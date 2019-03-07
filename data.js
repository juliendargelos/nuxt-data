export default class Data {
  constructor(source, slug = null) {
    Object.defineProperties(this, {
      slug: {
        value: slug,
        writable: true,
        configurable: true,
        enumerable: false
      }
    })

    this.forEach.call(source, (value, key) => {
      this[key] = this.constructor.from(value, key)
    })
  }

  get object() {
    return Object.assign({slug: this.slug}, this)
  }

  get props() {
    const props = {slug: this.slug}
    this.forEach((value, key) =>  {
      if(Array.isArray(value)) {
        props[key] = {type: Array, default: () => value}
      }
      else if(typeof value === 'object' && value !== null) {
        props[key] = {type: Object, default: () => value}
      }
      else props[key] = {default: value}
    })
    return props
  }

  forEach(callback, thisArg = null) {
    callback = callback.bind(thisArg || this)
    Object
      .entries(this)
      .forEach(([key, value], index) => callback(value, key, index, this))
  }

  reduce(callback, accumulator) {
    let entries = Object.entries(this)
    const provided = arguments.length > 1
    callback = callback.bind(this)

    if(!provided) {
      accumulator = entries[0] && entries[0][1]
      entries.shift()
    }

    entries.forEach(([key, value]) => {
      accumulator = callback(accumulator, value, key, index, this)
    })

    return accumulator
  }

  map(callback, thisArg = null) {
    const array = []
    callback = callback.bind(thisArg || this)
    this.forEach((...args) => array.push(callback(...args)))
    return array
  }

  sort(callback = (a, b) => a < b ? -1 : 1) {
    if(typeof callback === 'string') {
      const property = callback
      callback = (a, b) => a[property] < b[property] ? -1 : 1
    }

    callback = callback.bind(this)

    const source = Object
      .entries(this)
      .sort(([_, a], [__, b]) => callback(a, b))
      .reduce((source, [key, value]) => {
        source[key] = value
        return source
      }, {})

    return new this.constructor(source, this.slug)
  }

  filter(callback = value => value) {
    if(typeof callback === 'string') {
      const property = callback
      callback = value => value[property]
    } else if(typeof callback === 'object') {
      const properties = Object.entries(callback)
      callback = value => (
        properties.every(([property, v]) => value[property] === v)
      )
    }

    const source = Object
      .entries(this)
      .filter(([_, value]) => callback(value))
      .reduce((source, [key, value]) => {
        source[key] = value
        return source
      }, {})

    return new this.constructor(source, this.slug)
  }

  reverse() {
    return this.sort((a, b) => a < b ? 1 : -1)
  }

  static from(value, slug = null) {
    if(Array.isArray(value)) return value.map(this.from.bind(this))
    else if(typeof value === 'object' && value !== null) return new Data(value, slug)
    else return value
  }
}

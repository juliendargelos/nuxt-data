import path from 'path'
import glob from 'glob'
import fs from 'fs'
import yaml from 'js-yaml'
import Data from './data'

const dir = path.join(path.dirname(require.main.filename), '../../../data')

const source = glob.sync(path.join(dir, '**/*.yml')).reduce((source, file) => {
  file.substring(dir.length + 1).split('/').reduce((node, key, index, keys) => {
    if(index + 1 >= keys.length) {
      node[path.basename(key, '.yml')] = yaml.safeLoad(fs.readFileSync(file, 'utf-8'))
    }
    else if(typeof node[key] !== 'object' || node[key] === null) {
      node[key] = {}
    }

    return node[key]
  }, source)

  return source
}, {})

const data = new Data(source)

export { data }

export default function() {
  this.options.env.data = source
  this.extendBuild(config => { config.resolve.alias.data = path.join(__dirname, './client') })
}

# Nuxt data

Yaml based nuxt data module.

### Install

With yarn:

```shell
yarn add @juliendargelos/nuxt-data
```

With npm

```shell
npm install -s @juliendargelos/nuxt-data
```

### Usage

Add the module in nuxt config:

```javascript
export default {
  modules: [
    '@juliendargelos/nuxt-data'
  ]
}
```

Create a `data` folder at the root of your nuxt project. Project data is saved as yaml files and parsed with [`js-yaml`](https://github.com/nodeca/js-yaml). The structure of the folder determines data structure:

```
data/
 ├ settings.yml
 │   ┌────────────────────────────────────────────┐
 │   │ title: Website                             │
 │   │ description: This is a website.            │
 │   └────────────────────────────────────────────┘
 │
 ├ pages/
 │ └ home.yml
 │   ┌────────────────────────────────────────────┐
 │   │ title: Home                                │
 │   │ content: Welcome home.                     │
 │   └────────────────────────────────────────────┘
 │
 └ articles/
   ├ lorem-ipsum.yml
   │ ┌────────────────────────────────────────────┐
   │ │ title: Lorem ipsum                         │
   │ │ image: /uploads/lorem-ipsum.jpg            │
   │ │ content: Dolor sit amet.                   │
   │ └────────────────────────────────────────────┘
   │
   └ dolor-sit.yml
     ┌────────────────────────────────────────────┐
     │ title: Dolor sit                           │
     │ image: /uploads/dolor-sit.jpg              │
     │ content: Amet, consectetur.                │
     └────────────────────────────────────────────┘
```

Access data from javascript:

```javascript
// Inside webpack
import data from 'data'

// Outside webpack
import { data } from '@juliendargelos/nuxt-data'

data
// {
//   settings: {
//     title: 'Website',
//     description: 'This is a website.'
//   },
//   pages: {
//     home: {
//       title: 'Home',
//       content: 'Welcome home.'
//     }
//   },
//   articles: {
//     'lorem-ipsum': {
//       title: 'Lorem ipsum',
//       image: '/uploads/lorem-ipsum.jpg',
//       content: 'Dolor sit amet.'
//     },
//     'dolor-sit': {
//       title: 'Dolor sit',
//       image: '/uploads/lorem-ipsum.jpg',
//       content: 'Amet, consectetur.'
//     }
//   }
// }
```

The object exported from `data` is not just a javascript object, it's an instance of `Data`, and all objects (except arrays) it contains are also `Data` instances:

**Instance properties**:

- `slug`: Stores the key of the parent data which contains this instance. If it hasn't parent data, the slug is `null`.
- `object`: An object containing all the data values and its slug.
- `props`: An object that can be used to define vue component props with default values from the data.

**Instance methods**:

- `forEach`: Behaves the same as [Array.prototype.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) except there is a `key` argument passed to the callback function before the `index` arguments: `(value, key, index, data) => { }`.
- `map`: Behaves the same as [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) except there is a `key` argument passed to the callback function before the `index` arguments: `(value, key, index, data) => { }`.
- `filter`: Behaves the same as [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) except it returns a new `Data` instance instead of an array.
It can also take a string or an object as callback:
```javascript
// Equivalent
data.filter('foo')
data.filter(value => value.foo)
```
```javascript
// Equivalent
data.filter({foo: true, bar: 2})
data.filter(value => value.foo === true && value.bar === 2)
```
- `sort`: Behaves the same as [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) except it returns a new `Data` instance instead of mutating the original one.
It can also take a string as callback:
```javascript
// Equivalent
data.sort('foo')
data.sort((a, b) => a.foo < b.foo ? -1 : 1)
```
- `reverse`: Behaves the same as [Array.prototype.reverse](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse) except it returns a new `Data` instance instead of mutating the original one.

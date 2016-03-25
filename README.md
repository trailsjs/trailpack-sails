# trailpack-sails

[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Code Climate][codeclimate-image]][codeclimate-url]

This Trailpack allows you to run one or more Sails.js Applications within Trails.
Your existing Sails app is mounted on a route, and requests to subresources under
that endpoint are forwarded to the Sails app. This way, you can take advantage
of Trails' modern application design, and leverage your investment in Sails.

### Sails Version Compatibility
- 0.10.5
- 0.11.x
- 0.12.x

## Install

```sh
$ npm install --save trailpack-sails
```

## Configure

```js
// config/main.js
module.exports = {
  packs: [
    // ... other trailpacks
    require('trailpack-sails')
  ]
}
```

```js
// config/sails.js
module.exports = {

  apps: {
    mySailsApp: {

      /**
       * The filesystem path to the Sails Application. If installed via npm,
       * you can use require.resolve().
       * npm install --save my-sails-app
       */
      path: require.resolve('my-sails-app'),

      /**
       * The route on which to mount the Sails application. e.g. for prefix=sails,
       * the request /myapp/user?username=trails to Trails will be routed to
       * /user?username=trails in the Sails Application.
       */
      prefix: 'myapp',

      /**
       * Export the Sails app instance on the Trails context. Setting this to 'true'
       * would make available the property 'this.sails'
      export: false
    },

    anotherSailsApp: {
      // etc ...
    }
  }
```

<img src="http://i.imgur.com/dCjNisP.png">

[npm-image]: https://img.shields.io/npm/v/trailpack-sails.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trailpack-sails
[ci-image]: https://img.shields.io/travis/trailsjs/trailpack-sails/master.svg?style=flat-square
[ci-url]: https://travis-ci.org/trailsjs/trailpack-sails
[daviddm-image]: http://img.shields.io/david/trailsjs/trailpack-sails.svg?style=flat-square
[daviddm-url]: https://david-dm.org/trailsjs/trailpack-sails
[codeclimate-image]: https://img.shields.io/codeclimate/github/trailsjs/trailpack-sails.svg?style=flat-square
[codeclimate-url]: https://codeclimate.com/github/trailsjs/trailpack-sails


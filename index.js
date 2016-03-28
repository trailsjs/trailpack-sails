'use strict'

const vm = require('vm')
const url = require('url')
const path = require('path')
const joi = require('joi')
const Trailpack = require('trailpack')

module.exports = class SailsTrailpack extends Trailpack {

  validate () {
    const result = joi.validate(this.app.config.sails, joi.object())

    if (result.error) {
      this.log.error('The configuration for trailpack-sails does not look correct')
      this.log.error('Please double-check config/sails.js')
      this.log.error(result.error)
      return Promise.reject()
    }

    if (!this.app.config.web) {
      this.log.error('I do not see a valid web server configuration in this app')
      this.log.error('There is no config.web configuration. trailpack-sails requires a webserver')
      return Promise.reject()
    }
  }

  /**
   * TODO document method
   */
  configure () {
    const config = this.app.config
    const sailsConfig = this.app.config.sails

    this.apps = new Map()

    Object.keys(sailsConfig).map(appName => {
      const appConfig = {
        appPath: sailsConfig[appName].appPath,
        port: sailsConfig[appName].socketPath || path.resolve(config.main.paths.sockets, `${appName}.sock`),
        proxyPort: this.app.config.web.port,
        proxyHost: url.format({
          hostname: this.app.config.web.host,
          pathname: sailsConfig[appName].prefix,
          port: this.app.config.web.port
        })
      }
      this.apps.set(appName, {
        name: appName,
        config: appConfig,
        script: new vm.Script('require("./lib/sailsvm")(argv)', {
          filename: `sails/${appName}.vm`
        })
      })
    })
  }

  initialize () {
    return Promise.all(Array.from(this.apps.values(), app => {
      return new Promise((resolve, reject) => {
        const liftCallback = (err, sails) => {
          if (err) return reject(err)

          app.sails = sails
          resolve()
        }
        app.sandbox = vm.createContext({
          require: module.require,
          argv: {
            liftCallback,
            app
          }
        })
        this.log.info('Lifting Sails App', app.name)

        // launch Sails app in new Context
        app.script.runInContext(app.sandbox)
      })
    }))
  }

  unload () {
    return Array.from(this.apps.values(), app => {
      return new Promise((resolve, reject) => {
        app.lower(err => {
          if (err) {
            this.log.warn('Sails App', app.name, 'errored during unload')
            this.log.warn(err)
          }
          resolve()
        })
      })
    })
  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}


'use strict'

const joi = require('joi')
const Trailpack = require('trailpack')

module.exports = class SailsTrailpack extends Trailpack {

  validate () {
    const result = joi.validate(this.app.config.sails, joi.object().keys({
      apps: joi.object()
    }))

    if (result.error) {
      this.log.error('The configuration for trailpack-sails does not look correct')
      this.log.error('Please double-check config/sails.js')
      this.log.error(result.error)
      return Promise.reject()
    }
  }

  /**
   * TODO document method
   */
  configure () {
    const sailsConfig = this.app.config.sails

    this.appConfig = Object.keys(sailsConfig.apps).map((appName, i) => {
      const appConfig = sailsConfig.apps[appName]

      return {
        appPath: appConfig.path,
        //port:
        proxyPort: this.app.web.port
      }
    })
  }

  /**
   * TODO document method
   */
  initialize () {

  }

  constructor (app) {
    super(app, {
      config: require('./config'),
      api: require('./api'),
      pkg: require('./package')
    })
  }
}


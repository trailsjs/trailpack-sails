const Sails = require('sails')

module.exports = (argv) => {
  Sails.lift(argv.app.config, (err, sails) => {
    argv.liftCallback(err, sails)
  })
}

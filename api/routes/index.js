const stats = require('../stats')
const system = require('../system')

exports.configure = function (app, options) {
  app.use('/api', system(options))

  app.use('/api/stats', stats(options))
}

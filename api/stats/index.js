const express = require('express')
const Controller = require('./stats.controller')
const format = require('../lib/utils/format')

module.exports = function (options) {
  const router = express.Router()
  const controller = new Controller(options)

  router.get('/count/:host', (req, res, next) => controller.count(req, res, next))

  router.use('/', format)
  return router
}

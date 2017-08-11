const Controller = require('../stats.controller')
const {expect, assert} = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const chai = require('chai')
chai.use(sinonChai)
chai.should()

describe('stats Controller', function () {
  let controller, options

  describe('with an es instance', () => {
    beforeEach(() => {
      options = {
        es: {
          host: null,
          index: 'filebeat-*'
        }
      }
      controller = new Controller(options)
    })

    it('initialize and connect to es instance', () => {
      assert(controller.es)
      assert(controller.client)
    })

    it('counts requests with an host', () => {
      const req = {
        params: {
          host: 'particulier.api.gouv.fr'
        }
      }
      const res = {}
      return controller.count(req, res, function () {}).then((response) => {
        expect(res.data).to.gte(0)
      })
    })

    it('counts requests with an host and a query', () => {
      const req = {
        params: {
          host: 'particulier.api.gouv.fr'
        },
        query: { range: { time: { gte: 'now-30d' } } }
      }
      const res = {}
      return controller.count(req, res, function () {}).then((response) => {
        expect(res.data).to.gte(0)
      })
    })

    it('returns an error in bad request case', () => {
      const req = {
        params: {
          host: 'particulier.api.gouv.fr'
        },
        query: { foo: { time: { foo: 'boom' } } }
      }
      const res = {}
      const nextSpy = sinon.spy()
      return controller.count(req, res, nextSpy).then((response) => {
        nextSpy.firstCall.args[0].status.should.equals(400)
      })
    })
  })
})

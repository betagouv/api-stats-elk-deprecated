const serverTest = require('./../../test/utils/server')
// const {expect} = require('chai')

describe('stats API', function () {
  const server = serverTest()
  const api = server.api

  describe('/query', () => {
    it('replies a 200', () => {
      return api()
        .get('/api/stats/count')
        .expect(200)
    })

    it('accepts an host scope', () => {
      return api()
        .get('/api/stats/count/host.test')
        .expect(200)
    })

    it('accepts a query', () => {
      return api()
        .get('/api/stats/count/host.test')
        .query({ range: { time: { gte: 'now-30d' } } })
        .expect(200)
    })
  })
})

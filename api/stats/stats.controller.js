const StandardError = require('standard-error')
const elasticsearch = require('elasticsearch')

module.exports = class StatsController {
  constructor (options) {
    this.es = options.es
    this.client = new elasticsearch.Client({
      host: this.es.host,
      log: 'error'
    })
    return this
  }

  count (req, res, next) {
    const query = buildQueryFromReq(req)
    return this.client.count({
      index: this.es.index,
      body: { query: { bool: { must: query } } }
    }).then((response) => {
      res.data = response.count
      return next()
    }).catch((error) => {
      return next(new StandardError(error.body, {code: 400}))
    })
  }
}

function buildQueryFromReq (req) {
  const query = []
  for (let key in req.query) {
    let part = {}
    part[key] = req.query[key]
    query.push(part)
  }
  query.push({
    match: { tags: req.params.host }
  })
  query.push({
    exists: { field: 'consumer.organisation' }
  })
  return query
}

var pg = require('../')(require('pg'))
  , expect = require('chai').expect

describe('pg-run', () => {

  before((done) => {
    return pg(function*() {
      yield pg.query('CREATE TEMP TABLE foo(id serial, name varchar(50))')
      done()
    })
  })

  it('should run simple SQL command', (done) => {
    return pg(function*() {
      var result = yield pg.query('SELECT COUNT(*)::int as count FROM foo')
      expect(result.rows[0].count).to.equal(0)
      done()
    })
  })

  it('should run two SQL commands sequentially', (done) => {
    return pg(function*() {
      yield pg.query('INSERT INTO foo VALUES (1, \'John\')')
      yield pg.query('INSERT INTO foo VALUES (2, \'Bob\')')

      var result = yield pg.query('SELECT COUNT(*)::int as count FROM foo')
      expect(result.rows[0].count).to.equal(2)
      done()
    })
  })

  it('should run two SQL commands in parallel', (done) => {
    return pg(function*() {
      var result = yield [
        pg.query('SELECT 1 as count'),
        pg.query('SELECT 2 as count'),
        pg.query('SELECT 2 as count')
      ]
      expect(result[0].rows[0].count).to.equal(1)
      expect(result[1].rows[0].count).to.equal(2)
      done()
    })
  })

  it('should catch exception when pg throws an error', (done) => {
    return pg(function*() {
      yield pg.query('SELECT * FROM unknown_table')
    }, function(err) {
      done()
    })
  })

})

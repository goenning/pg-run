###Work is still in progress!

#pg-run

`pg-run` is a thin and fast wrapper around [node-postgres](https://github.com/brianc/node-postgres) with a `sync-like` API.

```
return pg(function*() {
  yield pg.query('INSERT INTO foo VALUES (1, \'John\')')
  yield pg.query('INSERT INTO foo VALUES (2, \'Bob\')')

  var result = yield pg.query('SELECT COUNT(*)::int as count FROM foo')
  expect(result.rows[0].count).to.equal(2)
  done()
})
```

###ES6 is mandatory! (Node v4.0.0+)

This project is highly based on [No promises: asynchronous JavaScript with only generators](http://www.2ality.com/2015/03/no-promises.html)

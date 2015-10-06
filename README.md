###Work is still in progress!

[![Build Status](https://travis-ci.org/goenning/pg-run.svg?branch=master)](https://travis-ci.org/goenning/pg-run)

#pg-run

`pg-run` is a thin and fast wrapper around [node-postgres](https://github.com/brianc/node-postgres) with a `sync-like` API.

```
var pg = require('pg-run')(require('pg'))

pg.connString = '<your connection string goes here>'

pg(function*() {
  yield pg.query('CREATE TEMP TABLE foo(id serial, name varchar(50))')
  yield pg.query('INSERT INTO foo VALUES (1, \'John\')')
  yield pg.query('INSERT INTO foo VALUES (2, \'Bob\')')

  var result = yield pg.query('SELECT COUNT(*)::int as count FROM foo')
  console.log(result.rows);
})
```

###ES6 is mandatory! (Node v4.0.0+)

This project is highly based on [No promises: asynchronous JavaScript with only generators](http://www.2ality.com/2015/03/no-promises.html)

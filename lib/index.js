'use strict'

function runGenObj(genObj, onFailure, callbacks) {

  function runInParallel(genObjs) {
    let resultArray = new Array(genObjs.length)
    let resultCountdown = genObjs.length
    for (var entry of genObjs.entries()) {
      let i = entry[0]
      , genObj = entry[1]

      runGenObj(genObj, onFailure, {
        success(result) {
          resultArray[i] = result
          resultCountdown--
          if (resultCountdown <= 0) {
            handleOneNext(resultArray)
          }
        },
        failure(err) {
          onFailure(err)
        }
      })
    }
  }

  function runYieldedValue(yieldedValue) {
    if (yieldedValue === undefined) {
      handleOneNext(callbacks)
    } else if (Array.isArray(yieldedValue)) {
      runInParallel(yieldedValue)
    } else {
      runGenObj(yieldedValue, onFailure, {
        success(result) {
          handleOneNext(result)
        },
        failure(err) {
          onFailure(err)
        }
      })
    }
  }

  function handleOneNext(prevResult) {
    let yielded = genObj.next(prevResult)
    if (yielded.done) {
      if (yielded.value !== undefined) {
        callbacks.success(yielded.value)
      }
    } else {
      setTimeout(runYieldedValue, 0, yielded.value)
    }
  }

  handleOneNext()
}

var PostgresRun = function(genFunc, onFailure) {
  runGenObj(genFunc(), onFailure, undefined)
}

PostgresRun.connString = ''

PostgresRun.query = function*(text) {
  const caller = yield
  PostgresRun.pg.connect(PostgresRun.connString, function(err, client, done) {
    if (err) { caller.failure(err) }
    client.query(text, [], function(err, result) {
      done()
      if (err) {
        caller.failure(err)
      } else {
        caller.success(result)
      }
    })
  })
}

module.exports = (pg) => {
  PostgresRun.pg = pg
  return PostgresRun
}

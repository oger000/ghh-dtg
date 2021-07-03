const logger = require('./logger')
const knex = require('knex')

const config = require('config')
const configVars = config.get('ghh_navi')
const opts = config.util.cloneDeep(configVars.knex)  // make opts mutable
const knexClientName = configVars.knex.client  // used for post process respone below

// some hardcoded database options
// opts.connection.fetchAsString = [ 'date', 'DATE', 'Date', 'datetime', 'clob' ]  // invalid option for mysql2
// opts.connection.timezone = '+00:00'  // delegated to config file, because may be not always wanted


if (knexClientName !== 'mysql2') {
  logger.warn('Only the "mysql2" client is supported.\nOther clients at your risk.')
}


// cleanup and compose knex logging
const prepMsg = (msg) => {
  if (typeof msg === 'object') {
    let msgOut = 'sql: ' + msg.sql
    if (Array.isArray(msg.bindings) && msg.bindings.length > 0) {
      msgOut += '\n  bindings: ' + JSON.stringify(msg.bindings)
    }
    msg = msgOut
  }
  return msg
}


opts.log = {
  error(msg) {
    logger.error(prepMsg(msg))
  },
  warn(msg) {
    logger.warn(prepMsg(msg))
  },
  // may be not used by knex
  info(msg) {
    logger.info(prepMsg(msg))
  },
  debug(msg) {
    logger.debug(prepMsg(msg))
  },
  // knex specific
  deprecate(msg) {
    logger.info(prepMsg(msg))
  }
}


// postprocess mysql2 response
opts.postProcessResponse = (result, queryContext) => {
  // logger.debug(`Post process response for client ${knexClientName}.`)
  // logger.debug('RAW-Result: ' + JSON.stringify(result))
  let isProcessed = false
  if (knexClientName === 'mysql2') {
    // select statement
    if (result && Array.isArray(result)
      && result.length === 2
      && Array.isArray(result[0])) {
      result = result[0]
      isProcessed = true
    }
  }  // eo mysql2

  logger.debug('SQL' + (isProcessed ? '+' : '-') + 'Result: ' + JSON.stringify(result))
  return result
}


module.exports = knex(opts)

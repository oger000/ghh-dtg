const { createLogger, format, transports } = require('winston')

/*
  npm (default): error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
  RFC5424: emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7
*/

const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'warn')


// formatter/transformer that ignores timestamp
const ignoreTimestamp = format((info, opts) => {
  delete info.timestamp
  return info
})  // eo ignore timestamp


// Configure the Winston logger. For the complete documentation seee https://github.com/winstonjs/winston
const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: level,
  format: format.combine(
    format.timestamp(),
    format.prettyPrint()
    //format.json()
  ),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'log/error.log', level: 'error' }),
    new transports.File({ filename: 'log/combined.log' })
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      level: 'warn',
      format: format.combine(
        ignoreTimestamp(),
        format.simple()
      )
    })
  )
}

module.exports = logger

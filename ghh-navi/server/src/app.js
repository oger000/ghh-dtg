const sessConnType = 'knex'

const express = require('express')

const compress = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const errorHandler = require('errorhandler')
const logger = require('./lib/logger')
const session = require('express-session')
// const sequelize = require('./lib/sequelize')
// const SequelizeSessionConnector = require('connect-session-sequelize')(session.Store)
const knex = require('./lib/knex')
const KnexSessionConnector = require('connect-session-knex')(session)
const oger = require('./lib/ogerlib')

// read config
// process.env['NODE_CONFIG_DIR'] = path.join(__dirname, '../config/')
const config = require('config')
const configVars = config.get('ogertimes')  // return value is immutable !!!

// create express app and use middleware
const app = express()
app.set('$logger', logger)

// Load app configuration
app.set('$config', configVars)
app.set('port', configVars.port)
app.set('host', configVars.host)

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet())
app.use(cors())
app.use(compress())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// session handling
// const sessionStoreSequelize = new SequelizeSessionConnector({
//   db: sequelize,
//   tableName: 'sessions_sequelize'
// })
// sessionStoreSequelize.sync()
const sessionStoreKnex = new KnexSessionConnector({
  knex,
  tablename: 'sessions_knex',
  createtable: true,
  clearInterval: (60 * 60 * 1000)
})
app.set('trust proxy', 1) // trust first proxy (even without https)
app.use(session({
  secret: 'ogersecret',
  resave: false, // per express-session docs this should be set to false because of race conditions on parallel requests
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
  // proxy: true // if you do SSL outside of node.,
  // store: sessionStoreSequelize
  store: sessionStoreKnex

}))

// log incomming urls in debug mode
app.use((req, resp, next) => {
  logger.debug(`${req.method} ${req.protocol}://${req.hostname}:${configVars.port}${req.path}` + (req.query.keys ? '?' + JSON.stringify(req.query) : ''))
  logger.debug(' +body=' + JSON.stringify(req.body))
  // logger.debug('-------------------- headers: \n')
  // logger.debug(JSON.stringify(req.headers))
  next()
})

// Set up the API for our services
app.use('/api', require('./services'))

// Host the public static folder
const staticFolder = configVars.public || './public'
app.use('/', express.static(staticFolder))

// Configure a middleware for 404s and the error handler
// app.use(express.notFound())
app.use(errorHandler({ logger }))

module.exports = app

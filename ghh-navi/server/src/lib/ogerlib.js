const HttpStatus = require('http-status-codes')
const logger = require('../lib/logger')


// send syntax errors
const sendError = (resp, err) => {
  const msg = err.toString()
  if (err.customType) {
    resp.statusMessage = msg
  } else if (err.sqlMessage) {
    resp.statusMessage = err.sqlMessage
    // msg = err.sqlMessage // only for HttpStatus.UNPROCESSABLE_ENTITY
    // HttpStatus.UNPROCESSABLE_ENTITY
  }
  if (err.customType !== 'APP') {
    logger.error(err.stack)
  }
  return resp.status(err.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR).send(msg)
}


// send data
const sendData = (resp, data) => {
  return resp.send({
    data: data
  })
}


// format validation errors
const validErrorMsg = (vErr) => {
  return vErr.reduce((acc, cur) => { return acc + cur + '. '}, '')
}


// the custom error class
class CustomError {
  constructor (message) {
    this.message = message
    this.name = 'CustomError'
    this.customType = 'APP'
  }
  toString () {
    return this.message
  }
}

// a user failure class
class UserFailure extends CustomError {
  constructor (message) {
    super(message)
    this.name = 'UserFailure'
    this.httpStatus = HttpStatus.UNPROCESSABLE_ENTITY
  }
}

// a validation failure class
class ValidateFailure extends CustomError {
  constructor (vErr) {
    super(validErrorMsg(vErr))
    this.name = 'ValidateFailure'
    this.httpStatus = HttpStatus.UNPROCESSABLE_ENTITY
  }
}

// a permission error class
class PermissionError extends CustomError {
  constructor (message) {
    super(message)
    this.name = 'PermissionError'
    this.httpStatus = HttpStatus.FORBIDDEN
  }
}

// a unauthorzed error class
class UnauthorizedError extends CustomError {
  constructor (message) {
    super(message)
    this.name = 'UnauthorizedError'
    this.httpStatus = HttpStatus.UNAUTHORIZED
  }
}


// remove undefined keys from objects
// see <https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript#38340730>
const removeUndef = (obj) => {
  const o = JSON.parse(JSON.stringify(obj)); // Clone source oect.

  Object.keys(o).forEach(key => {
    if (o[key] && typeof o[key] === 'object')
      o[key] = removeUndef(o[key])  // Recurse.
    else if (o[key] === undefined)  //  || o[key] === null
      delete o[key]
    else
      o[key] = o[key]
  })

  return o
}  // eo remove undef


// remove undefined keys from objects
// see <https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript#38340730>
const removeUndef2 = (obj) => {

  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object')
      obj[key] = removeUndef2(obj[key])  // Recurse.
    else if (obj[key] === undefined)  //  || o[key] === null
      delete obj[key]
  })

  return obj
}  // eo remove undef


// exports
module.exports = {
  sendError,
  sendData,
  validErrorMsg,
  CustomError,
  UserFailure,
  UnauthorizedError,
  PermissionError,
  ValidateFailure,
  removeUndef
}

const { userHasPerm } = require('../shared/userHasPerm')
const { UnauthorizedError, PermissionError } = require('../lib/ogerlib')

// check if login user of the session has specific permission
const sessionHasPerm = function (req, perm) {

  if (!(req.session && req.session.login && req.session.login.user)) {
    return false
  }

  return userHasPerm(req.session.login.user, perm)
}  // eo session has permission


// require permission for logged in session user
const requireSessionPerm = function (req, perm) {

  if (!sessionHasPerm(req, perm)) {
    throw new UnauthorizedError('Für diese Aktion müssen Sie sich anmelden.')
  }

  if (!userHasPerm(req.session.login.user, perm)) {
    throw new PermissionError(`Ihnen fehlt das ${perm.toUpperCase()}-Recht für diese Aktion.`)
  }
}  // eo require permission for session


module.exports = {
  userHasPerm,
  sessionHasPerm,
  requireSessionPerm
}

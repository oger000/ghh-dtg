// Initializes the service
const { UserFailure, ValidateFailure } = require('../lib/ogerlib')
const bcrypt = require('bcrypt')
const validate = require('validate.js')
const knex = require('../lib/knex')
const moment = require('../lib/moment')
const { sessionHasPerm } = require('./sessionPerm')


const tableName = 'user'
const validRule = require(`../validate/${tableName}.validate.js`)

const initialAdminName = 'superadmin'
const initialAdminPassword = 'super'
const pwSaltRounds = 10


// force inital user
const forceInitialUser = async () => {

  const userCount = await knex
    .count('* AS total')
    .from(tableName)
    .then(rows => rows[0].total)

  if (userCount === 0) {
    await knex
      .insert({
        name: initialAdminName,
        password: await bcrypt.hash(initialAdminPassword, pwSaltRounds),
        loginperm: 1,
        superperm: 1
      })
      .into(tableName)
  }
}  // eo force inital user


// login handling, check login by name
const login = async (req) => {
  const vals = req.body

  const vErr = validate(vals, validRule.login)
  if (vErr) {
    throw new ValidateFailure(vErr)
  }

  // check for empty input values
  vals.name = (vals.name || '').trim()
  if (!vals.name) {
    throw new UserFailure('Benutzername muss angegeben werden.')
  }
  vals.password = (vals.password || '').trim()
  if (!vals.password) {
    throw new UserFailure('Passwort muss angegeben werden.')
  }

  await forceInitialUser()

  const user = await knex
    .select('*')
    .from(tableName)
    .where({ name: vals.name })
    .then(rows => rows[0])

  if (!user) {
    throw new UserFailure('Anmeldename oder Passwort falsch.')
  }

  user.password = (user.password || '').trim()
  if (!user.password) {
    throw new UserFailure('Zu diesem Benutzernamen wurde kein Passwort verspeichert - bitte nachholen.')
  }

  const validPassword = await bcrypt.compare(vals.password, user.password)
  if (!validPassword) {
    throw new UserFailure('Passwort oder Anmeldename falsch.')
  }
  delete user.password
  if (!+user.loginperm) {
    throw new UserFailure('Sie haben keine Anmelde-Berechtigung.')
  }

  // check login timeframe
  const now = moment()
  if (user.begindate && now.isBefore(user.begindate)) {
    throw new UserFailure(`Sie können sich erst ab dem ${ moment(user.begindate).format('L') } anmelden. Das Systemdatum ist aber der ${ now.format('L') }.`)
  }
  if (user.enddate && now.isAfter(user.enddate)) {
    throw new UserFailure(`Sie konnten sich nur bis zum ${ moment(user.enddate).format('L') } anmelden. Das Systemdatum ist aber der ${ now.format('L') }.`)
  }

  // complement login user with permissions
  user.perms = await getUserPerms(user, { userGroupIdsFrom: 'db' })

  delete user.password
  req.session.login = req.session.login || {}
  req.session.login.user = user
  return user
}  // eo login


// change password
const changePassword = async (req) => {
  const vals = req.body

  // check input
  if (+vals.userid !== req.session.login.user.id) {
    throw new UserFailure(`Invalid user id: '${vals.userid}'.`)
  }
  vals.oldPassword = vals.oldPassword.trim()
  vals.newPassword = vals.newPassword.trim()

  const vErr = validate(vals, validRule.changePassword)
  if (vErr) {
    throw new ValidateFailure(vErr)
  }
  vals.newPasswordEncrypted = await checkAndEncryptPassword(vals.newPassword, { confirmPassword: vals.confirmPassword })

  // check old password
  // vals.oldPassword = checkAndEncryptPassword(vals.oldPassword, 'Altes Passwort: ')
  const user = await knex
    .select('password')
    .from(tableName)
    .where({ id: vals.userid })
    .then(rows => rows[0])
  if (!user) {
    throw new UserFailure(`User-Id: '${vals.userid}' nicht gefunden.`)
  }
  const validPassword = await bcrypt.compare(vals.oldPassword, user.password)
  if (!validPassword) {
    throw new UserFailure('Das alte Passwort ist falsch.')
  }

  // save new password
  await knex(tableName)
    .update({ password: vals.newPasswordEncrypted })
    .where({ id: vals.userid })

} // eo change password


// prep and precheck password
const checkAndEncryptPassword = async (pw, opts) => {
  opts.extraInfo = opts.extraInfo || ''

  pw = (pw || '').trim()
  let vErr = validate({ password: pw }, validRule.passwordOnly)
  if (vErr) {
    throw new ValidateFailure(extraInfo + vErr)
  }
  // double check for empty passwords
  if (!pw) {
    throw new UserFailure(extraInfo + 'Passwort darf nicht leer sein.')
  }

  if ('confirmPassword' in opts) {
    opts.confirmPassword = (opts.confirmPassword || '').trim()
    if (pw !== opts.confirmPassword) {
      throw new UserFailure('Passwortwiederholung stimmt nicht mit Passwort überein.')
    }
  }

  return await encryptPassword(pw, opts.extraInfo)
}  // eo precheck password


// encrypt password
const encryptPassword = async (pw, extraInfo = '') => {

  // check for empty passwords
  pw = (pw || '').trim()
  if (!pw) {
    throw new UserFailure(extraInfo + 'Leeres Passwort nicht erlaubt (enc).')
  }

  return await bcrypt.hash(pw, pwSaltRounds)
}  // eo encrypt password


// get permissions for user (maybe user group list is virtual)
// opts.userGroupIdsFrom : 'db', 'obj...'
const getUserPerms = async (user, opts) => {

  let perms = {}

  // dirctly bound perms
  perms.loginperm = user.loginperm
  perms.superperm = user.superperm
  perms.owntimeperm = user.owntimeperm

  // via usergroups from user object or from db
  let userGroupIds = []
  let userGroupList = null
  switch (opts.userGroupIdsFrom) {
    case 'db':
      userGroupList = await knex
        .select('*')
        .from('usergroup')
        .join('user_to_usergroup', 'user_to_usergroup.usergroup_id', "=", 'usergroup.id')
        .where('user_to_usergroup.user_id', "=", knex.raw(user.id))
      /*
      let tmpUserGroupIds = await knex
        .select('usergroupid')
        .from('user_to_usergroup')
        .where('userid', '=', knex.raw(user.id))
      userGroupIds = tmpUserGroupIds.reduce((acc, curr) => {
        return acc.concat(curr.usergroupid)
      }, [])
      */
      break
    case 'obj.userGroupListSelected':
      userGroupIds = user.userGroupList.reduce((acc, curr) => {
        return curr.selected ? acc.concat(curr.usergroupid) : acc
      }, [])
      break
    case 'obj.userGroupIds':
      userGroupIds = user.userGroupIds
      break
    default:
      throw new Error('Function userGetPerms: Missing userGroupIdsFrom Option.')
  }

  if (userGroupList === null) {
    userGroupList = await knex
      .select('*')
      .from('usergroup')
      .whereIn('id', userGroupIds)
  }

  const fields = userGroupList.length > 0 ? Object.keys(userGroupList[0]) : []
  perms = userGroupList.reduce((acc, curr) => {
    fields.forEach(field => {
      if (field.endsWith('perm')) {
        acc[field] = Math.max(acc[field] || 0, curr[field])
      }
    })
    return acc
  }, perms)

  // populate subpermissions from superpermissions
  const subPermTree = new Map([
    ['superperm', ['adminperm']],
    ['adminperm', ['masterperm']],
    ['masterperm', ['timeperm']],
    ['timeperm', ['owntimeperm']]
  ])

  subPermTree.forEach((childPerms, parentPerm) => {
    if (perms[parentPerm]) {
      childPerms.forEach(childPerm => {
        perms[childPerm] = perms[parentPerm] // = 1
      })
    }
  })

  // perms object
  return perms
}  // eof get permissions


// check that session has a minimal set of permissions
const sessionHasMinimumPerms = (req, perms) => {
  const permKeys = Object.keys(perms)
  for (const perm of permKeys) {
    if (perm.endsWith('perm')) { // skip non-perm-keys (eg usergroup obj)
      if (perms[perm] && !sessionHasPerm(req, perm)) {
        return false
      }
    }
  }
  return true
} // eo session has minimum perms


// report perms that the session lacks
// opts.humanFormat
const sessionMissingPerms = (req, perms, opts = {}) => {
  const permKeys = Object.keys(perms)
  let missing = new Set()
  for (const perm of permKeys) {
    if (perm.endsWith('perm')) { // skip non-perm-keys (eg usergroup obj)
      if (perms[perm] && !sessionHasPerm(req, perm)) {
        missing.add(perm)
      }
    }
  }
  missing = Array.from(missing)
  if (opts.humanFormat) {
    missing = missing.map(perm => perm.substr(0, perm.length - 4).toUpperCase())
  }
  return missing
} // eo perms that session lacks


// report perm differences
// opts.humanFormat
const permsDiff = (perms1, perms2, opts = {}) => {
  const permKeys1 = Object.keys(perms1)
  const permKeys2 = Object.keys(perms2)
  let diff = new Set()
  permKeys1.forEach(perm => {
    if (perm.endsWith('perm')) { // skip non-perm-keys (eg usergroup obj)
      if (perms1[perm] != perms2[perm]) { // lacy compare
        diff.add(perm)
      }
    }
  })
  permKeys2.forEach(perm => {
    if (perm.endsWith('perm')) { // skip non-perm-keys (eg usergroup obj)
      if (perms1[perm] != perms2[perm]) { // lacy compare
        diff.add(perm)
      }
    }
  })

  diff = Array.from(diff)
  if (opts.humanFormat) {
    diff = diff.map(perm => perm.substr(0, perm.length - 4).toUpperCase())
  }
  return diff
} // eo perm differences


// exports
module.exports = {
  login,
  changePassword,
  checkAndEncryptPassword,
  encryptPassword,
  getUserPerms,
  sessionHasMinimumPerms,
  sessionMissingPerms,
  permsDiff
}

const express = require('express')
const router = express.Router()
const { requireSessionPerm } = require('./sessionPerm')
const { sendError } = require('../lib/ogerlib')
const { login, changePassword, getUserPerms } = require('./userfuncs')
const knex = require('../lib/knex')


// handle services that need no auth here

// login handling
router.post('/login', async (req, resp) => {
  try {
    await login(req)
    return resp.send(req.session.login.user)
  } catch(err) {
    return sendError(resp, err)
  }
})  // eo login


// logout handling
router.post('/logout', async (req, resp) => {
  delete req.session.login
  return resp.send('Abmeldung durchgeführt. Auf Wiedersehen.')
})  // eo logout


// force a valid login for all following routes
router.all('*', async (req, resp, next) => {
  try {
    requireSessionPerm(req, 'login')
  } catch(err) {
    return sendError(resp, err)
  }
  next()
})


// renew current logged in user permissions
router.get('/renewLogin', async (req, resp) => {
  try {
    const user = await knex
      .select('*')
      .from('user')
      .where({ id: req.session.login.user.id })
      .then(rows => rows[0])
    delete user.password
    user.perms = await getUserPerms(user, { userGroupIdsFrom: 'db' })
    req.session.login.user = user
    return resp.send(req.session.login.user)
  } catch(err) {
    return sendError(resp, err)
  }
})  // eo get login user

// change password
router.post('/changePassword', async (req, resp) => {
  try {
    await changePassword(req)
    return resp.send('Das Passwort wurde erfolgreich geändert.')
  } catch(err) {
    return sendError(resp, err)
  }
})  // eo change password


// define the routes for services that need a valid authentification
router.use('/master/user', require('./user.service.js'))
router.use('/master/usergroup', require('./usergroup.service.js'))
router.use('/master/person', require('./person.service.js'))
router.use('/master/project', require('./project.service.js'))
router.use('/master/task', require('./task.service.js'))


module.exports = router

// Initializes the service
const express = require('express')
const router = express.Router()
const knex = require('../lib/knex')
const oger = require('../lib/ogerlib')
const UserFailure = oger.UserFailure
const { ogerWhere, ogerSelectModify } = require('../lib/ogerKnex')
const HttpStatus = require('http-status-codes')
const validate = require('../lib/validate.js')
const { requireSessionPerm, sessionHasPerm } = require('./sessionPerm')

const { checkAndEncryptPassword, getUserPerms, sessionHasMinimumPerms, sessionMissingPerms, permsDiff } = require('./userfuncs.js')
const bcrypt = require('bcrypt')

const tableName = 'user'
const validRule = require(`../validate/${tableName}.validate.js`)


// check perm for all routes
router.all('*', async (req, resp, next) => {
  try {
    requireSessionPerm(req, 'master')
  } catch(err) {
    return sendError(resp, err)
  }
  next()
})


// get list of data rows
//router.get('/', async (req, resp) => {
router.post('/get-list', async (req, resp) => {
  try {
    const vals = req.body

    const where = knex.queryBuilder()
    vals.filter = vals.filter || {}
    if (vals.filter.searchName) {
      where.andWhere('name', 'like', `%${vals.filter.searchName}%`)
    }
    if (vals.filter.id) {
      where.andWhere('id', '=', vals.filter.id)
    }
    let query = where.clone()

    for (const sort of vals.sort || []) {
      query = query.orderBy(sort[0], sort[1])
    }

    const rows = await query
      .select(['id', 'name', 'beginDate', 'endDate', 'loginperm', 'superperm'])
      .from(tableName)
      .modify(qb => ogerSelectModify(qb, {
        limit: vals.limit,
        offset: vals.offset
      }))

      const count = await where
        .count('* AS total')
        .from(tableName)
        .then(rows => rows[0].total)

    return resp.send({ rows: rows, count: count })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo list of data rows


// get user group list for new user
router.get('/userGroupList', async (req, resp) => {
  try {
    const rows = await knex
      .select(['*', 'id AS usergroup_id'])
      .from('usergroup')
    rows.forEach(row => {
      if (!sessionHasMinimumPerms(req, row)) {
        row.disabled = true
      }
    })
    return resp.send({ rows, count: rows.length })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo get user group list for new user


// get single record with user groups
router.get('/:id', async (req, resp) => {
  try {
    const user = await knex
      .select('*')
      .from(tableName)
      .where({ id: req.params.id })
      .then(rows => rows[0])
    delete user.password

    const userGroupList = await knex
      .select(
        knex.ref('user_to_usergroup.id').as('usrtogrpid'), // recid is used to identify selected user groups
        knex.ref('usergroup.id').as('usergroup_id'),
        knex.ref('usergroup.*')
      )
      .from('user_to_usergroup')
      .rightJoin('usergroup', function() {
        this.on('user_to_usergroup.usergroup_id', '=', 'usergroup.id')
        .andOn('user_to_usergroup.user_id', '=', user.id)
      })
      .orderBy('usergroup.name')

    const userPerms = await getUserPerms(user, { userGroupIdsFrom: 'db' })
    if (!sessionHasMinimumPerms(req, userPerms)) {
      user.disabled = true
    }

    // if user not disabled completly, then disable usergroups with more perms than session
    if (!user.disabled) {
      const fields = userGroupList.length > 0 ? Object.keys(userGroupList[0]) : []
      userGroupList.forEach(usrGrp => {
        fields.forEach(field => {
          if (field.endsWith('perm') && usrGrp[field] && !sessionHasPerm(req, field)) {
            usrGrp.disabled = true
          }
        })
      })
    } // disable user groups depending on perms

    const person = await knex
      .select(['id', 'firstname', 'lastname', 'begindate', 'enddate'])
      .from('person')
      .where('xid', '=', user.id)

    user.userGroupList = userGroupList
    user.person = person
    return resp.send(user)
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo get single record


// insert new record
router.post('/', async (req, resp) => {
  try {
    const vals = req.body
    delete vals.id  // remove serial (autoinc)

    // validate input
    const vErr = validate(vals, validRule.insert)
    if (vErr) {
      throw new oger.ValidateFailure(vErr)
    }
    vals.password = await checkAndEncryptPassword(vals.password, { confirmPassword: vals.confirmPassword })

    // check grant perms restriction
    vals.userGroupList = vals.userGroupList || []
    vals.userGroupIds = vals.userGroupList.reduce((acc, curr) => {
      return curr.selected ? acc.concat(curr.usergroup_id) : acc
    }, [])
    vals.perms = await getUserPerms(vals, { userGroupIdsFrom: 'obj.userGroupIds' })
    const missingPerms = sessionMissingPerms(req, vals.perms, { humanFormat: true })
    if (missingPerms.length) {
      throw new UserFailure(`Sie können keine ${missingPerms.join('-, ')}-Rechte vergeben, weil sie diese selbst nicht besitzen.`)
    }

    // remove non-column properties and store user
    const userGroupIds = vals.userGroupIds
    delete vals.confirmPassword
    delete vals.userGroupList
    delete vals.userGroupIds
    delete vals.perms
    delete vals.personList

    let userId = null
    await knex.transaction(async trx => {
      const ids = await trx.insert(vals).into(tableName).returning('id')
      userId = ids[0]

      // save usergroups
      const userToUserGroupList = userGroupIds.map(userGroupId => {
        return { user_id: userId, usergroup_id: userGroupId }
      })
      if (userToUserGroupList.length) {
        await trx.insert(userToUserGroupList).into('user_to_usergroup')
      }
    }) // oe transaction

    return resp.send({ id: userId })
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo insert new record


// update redord
router.post('/:id', async (req, resp) => {
  try {
    const vals = req.body
    delete vals.id

    // check session permissions against existing user permissions
    const oldUser = await knex
      .select('*')
      .from(tableName)
      .where({ id: req.params.id })
      .then(rows => rows[0])
    oldUser.perms = await getUserPerms(oldUser, { userGroupIdsFrom: 'db' })

    const missingPerms1 = sessionMissingPerms(req, oldUser.perms, { humanFormat: true })
    if (missingPerms1.length) {
      throw new UserFailure(`Diese BenutzerIn hat ${missingPerms1.join('-, ')}-Rechte und kann daher von Ihnen nicht geändert werden.`)
    }

    // validate input
    const vErr = validate(vals, validRule.update)
    if (vErr) {
      throw new oger.ValidateFailure(vErr)
    }
    if (vals.password) {
      vals.password = await checkAndEncryptPassword(vals.password, { confirmPassword: vals.confirmPassword })
    } else {
      delete vals.password
    }

    // check change perms restriction
    vals.userGroupList = vals.userGroupList || []
    vals.userGroupIds = vals.userGroupList.reduce((acc, curr) => {
      return curr.selected ? acc.concat(curr.usergroup_id) : acc
    }, [])
    vals.perms = await getUserPerms(vals, { userGroupIdsFrom: 'obj.userGroupIds' })
    const permDiff = permsDiff(vals.perms, oldUser.perms, { humanFormat: true })
    const missingPerms2 = sessionMissingPerms(req, vals.perms, { humanFormat: true })
    const changedPerms = Array.from(new Set([...permDiff, ...missingPerms2]))
    if (changedPerms.length) {
      throw new UserFailure(`Sie können die ${missingPerms2.join('-, ')}-Rechte nicht verändern, weil sie diese selbst nicht besitzen.`)
    }

    // remove non-column properties and store user
    const userGroupList = vals.userGroupList
    const userGroupIds = vals.userGroupIds
    delete vals.confirmPassword
    delete vals.userGroupList
    delete vals.userGroupIds
    delete vals.perms
    delete vals.personList

    await knex.transaction(async trx => {
      await trx(tableName)
        .update(vals)
        .where({ id: req.params.id })
        .returning('id')

      // update assigned groups
      for (const userGroup of userGroupList) {
        if (userGroup.selected && !userGroup.usrtogrpid) {
          await trx
            .insert({
              user_id: req.params.id,
              usergroup_id: userGroup.id
            })
            .into('user_to_usergroup')
        } else if (!userGroup.selected && userGroup.usrtogrpid) {
          await trx
            .del()
            .from('user_to_usergroup')
            .where({ id: userGroup.usrtogrpid, user_id: req.params.id })
        }
      }  // update assigned groups
    }) // oe transaction

    return resp.sendStatus(HttpStatus.OK)
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo update record


// delete record and assigned usergroups
router.delete('/:id', async (req, resp) => {
  try {
    const id = +req.params.id
    if (!id) {  // paranoid check
      throw new UserFailure('Die ID des zu löschenden Eintrags fehlt.')
    }
    if (id === req.session.login.user.id) {
      throw new UserFailure('Aktuell angemeldete BenutzerIn kann nicht gelöscht werden.')
    }

    // check session permissions against existing user permissions
    const oldUser = await knex
      .select('*')
      .from(tableName)
      .where({ id: req.params.id })
      .then(rows => rows[0])
    oldUser.perms = await getUserPerms(oldUser, { userGroupIdsFrom: 'db' })

    const missingPerms = sessionMissingPerms(req, oldUser.perms, { humanFormat: true })
    if (missingPerms.length) {
      throw new UserFailure(`Diese BenutzerIn hat ${missingPerms.join('-, ')}-Rechte und kann daher von Ihnen nicht gelöscht werden.)`)
    }

    // precess deletion
    let deleteCount = 0
    let deleteCountUsrGrps = 0
    await knex.transaction(async trx => {
      deleteCountUsrGrps = await trx
        .del()
        .from('user_to_usergroup')
        .where({ user_id: id })

      deleteCountPers = await trx('person')
        .update({ user_id: null })
        .where({ user_id: id })

      deleteCount = await trx
        .del()
        .from(tableName)
        .where({ id: id })
    }) // eo transaction

    throw new UserFailure(`Es wurde ${deleteCount} Eintrag gelöscht.`)
  } catch(err) {
    return oger.sendError(resp, err)
  }
})  // eo delete record


// exports
module.exports = router

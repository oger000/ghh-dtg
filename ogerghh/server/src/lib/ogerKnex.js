const knex = require('../lib/knex')
const logger = require('../lib/logger')


// Add WHERE statements to knex query builder
const ogerWhere = (qb, filters) => {
  if (Array.isArray(filters)) {
    filters.forEach(filter => {
      if (Array.isArray(filter)) {
        qb.where(...filter)
      }
      if (typeof filter === 'object' && filter.col) {
        switch (filter.cond.toLowerCase()) {
          case 'or':
            qb.orWhere(filter.col, filter.op, filter.val)
            break
          default:
            qb.where(filter.col, filter.op, filter.val)
        }
      }
    })
  }
  return qb
}  // eo oger where


// Add filters, sort, limit and offset to select statement
const ogerSelectModify = (qb, opts = {}) => {

  if (opts.filters)
    ogerWhere(qb, opts.filters)

  if (opts.orderBy)
    qb.orderBy(opts.orderBy)

  if (opts.limit)
    qb.limit(opts.limit)

  if (opts.offset)
    qb.offset(opts.offset)

    return qb
} // modify (add to) select statement


module.exports = {
  ogerWhere,
  ogerSelectModify
}

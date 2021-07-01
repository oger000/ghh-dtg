const validate = require('validate.js')

validate.options = {format: 'flat'}

// Before using datetime validation we must add a parse and format function
validate.extend(validate.validators.datetime, {
  parse: function(value, options) {
    return Date.parse(value)
    // return +moment.utc(value)
  },
  format: function(value, options) {
    const format = options.dateOnly ? "YYYY-MM-DD" : "YYYY-MM-DD hh:mm:ss"
    return value.toISOString()
    // return moment.utc(value).format(format)
  }
})


module.exports = validate

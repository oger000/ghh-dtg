const csv = require('csvtojson')

const csvIn = csv({
  delimiter: ';',
  trim: true,
  ignoreEmpty: false  // false is default
})


module.exports = csvIn

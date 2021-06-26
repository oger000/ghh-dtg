const xml2js = require('xml2js')

const xmlParser = new xml2js.Parser({
  trim: true,
  explicitArray: false
})


module.exports = xmlParser

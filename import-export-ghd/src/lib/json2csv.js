const { Parser } = require('json2csv')

const csvOut = new Parser({
  delimiter: ';'
  // excelStrings: true,
  // withBOM: true  // ??? maybe needed for excel
})

module.exports = csvOut

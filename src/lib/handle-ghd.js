
const db = require(__dirname + '/knex')

// "globals"
const ghdIdFields = [ 'va_ra', 'gkz', 'finanzjahr', 'quartal' ]




// handle xml data and prepare for database
async function handleXml(config, data) {
  if (config.vrv == 2015) {
    await handleXml2015(config, data)
  }
  else if (config.vrv == 1997) {
    console.log('Datenstruktur 1997 (XML) noch nicht implementiert.')
  }
}  // eo handle xml


// put xml data structure (vrv 2015 ghd xml 3.7) to database
async function handleXml2015(config, data) {
  console.log('handleXml2015')
}  // eo handle xml 2015



module.exports = {
  handleXml
}

/*
*/

const fs = require('fs')
const csv = require(__dirname + '/lib/csvtojson')
const xmlParser = require(__dirname + '/lib/xml2js')

const { handleXml } = require(__dirname + '/lib/handle-ghd')


// separated because of await/async
async function fake_main() {

  const configGdt = __dirname + '/config-ghd.csv'
  console.log(`Verwende Konfigurationsdatei ${configGdt}.`)
  if(!fs.existsSync(configGdt)) {
    console.log(`Konfigurationsdatei nicht gefunden.`)
    process.exit(1)
  }

  const configRecs = await csv.fromFile(configGdt)
  for (configRec of configRecs) {
    if (!configRec.handle) {
      continue
    }

    if(!fs.existsSync(configRec.file_name)) {
      console.log(`Datendatei ${configRec.file_name} nicht gefunden.`)
      continue
    }

    console.log(`Verarbeite ${configRec.file_name}.`)
    let fileType = configRec.file_name.split('.').pop().toLowerCase()
    if (fileType == 'xml') {
      console.log(`Verwende Dateityp ${fileType}.`)
      const xmlContent = fs.readFileSync(configRec.file_name).toString()
      const ghdObj = await xmlParser.parseStringPromise(xmlContent)
      await handleXml(configRec, ghdObj)
    }
    else if (fileType == 'txt') {
      console.log('Dateistruktur TXT noch nicht implementiert.')
      // handleCsv(configRec)
    } else {
      console.log(`Unbekannter Dateityp: ${fileType}`)
    }
  }
}  // eo main


// start the async main function
(async () => {
  try {
    await fake_main();
  } catch (ex) {
    console.log('Fehlerbehandlung nicht implementiert. Uncached error:')
    console.log(ex)
  }
  process.exit(0)
})();

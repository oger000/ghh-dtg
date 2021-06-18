/*
Datenquelle:
https://www.bmf.gv.at/themen/budget/finanzbeziehungen-laender-gemeinden/vrv-2015.html
Kopfzeile:
KL;kl_name;UK;uk_name;grp;grp_name;ehh_e2;fhh_ein_e2;fhh_aus_e2;vhh_e2;quer
*/

const fs = require('fs')
const csv = require('csvtojson')
const knex = require('knex')
const knexfile = require(__dirname + '/../config/knexfile')
const db = knex(knexfile)

const csvIn = csv({
  delimiter: ';',
  trim: true,
  ignoreEmpty: false  // false is default
})

const dataDir = __dirname + '/../data-localonly/'
const inputFile = dataDir + 'konten15.csv'
if(fs.existsSync(inputFile)) {
  console.log('Daten von: ' + inputFile)
}
else {
  console.log(inputFile + ' nicht gefunden.')
  process.exit()
}


// haupt app (separate funktion wegen await/async)
main()
.then(() => {
    console.log('*** ENDE THEN ***')
    process.exit()
  }
)
.catch((err) => {
  console.log(err)
  process.exit()
})


// main app
async function main() {

  let recOutAll = []
  const recInAll = await csvIn.fromFile(inputFile)
  for (let i = 0; i < recInAll.length; i++) {
    let recIn = recInAll[i]
    /*
    if (i > 10) {
      break
    }
    */

    let grpNum = recIn.KL || recIn.UK || recIn.grp
    let name = recIn.kl_name + recIn.uk_name + recIn.grp_name
    let querParts = recIn.quer.split('/')
    let quer_ein = querParts[0].trim()
    let quer_aus = (querParts[1] || '').trim()
    quer_aus = quer_aus || quer_ein

    let recOut = {
      vrv: '2015',
      grpnum: grpNum,
      name: name,
      ehh_e2: recIn.ehh_e2,
      fhh_ein_e2: recIn.fhh_ein_e2,
      fhh_aus_e2: recIn.fhh_aus_e2,
      vhh_e2: recIn.vhh_e2,
      quer_ein: quer_ein,
      quer_aus: quer_aus
    }

    // console.log('' + i + ' ' + recOut.grpnum + ' = ' + recOut.name)
    recOutAll.push(recOut)
  }
  console.log('Begin: Write ' + recOutAll.length + ' records to db.')
  const tableName = 'vrv_kontogruppe'
  await db(tableName).truncate()
  await db.batchInsert(tableName, recOutAll)
  console.log('End: Write to db.')
}  // eo main

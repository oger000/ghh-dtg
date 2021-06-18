/*
Datenquelle:
https://www.bmf.gv.at/themen/budget/finanzbeziehungen-laender-gemeinden/vrv-2015.html
Kopfzeile:
//"A";"U";"Bezeichnung";dummy
"A";"U";"Bezeichnung"
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
const inputFile = dataDir + 'ansatz15.csv'
if(fs.existsSync(inputFile)) {
  console.log('Lese Daten von: ' + inputFile)
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

    if (recIn.A === 'A') {
      continue
    }
    if (recIn.A.startsWith('Gruppe')) {
      recIn.Bezeichnung = recIn.A.substr(11).replace(/ \(.*$/, '').trim()
      recIn.A = recIn.A.substr(7,1)
    }

    let grpNum = recIn.A || recIn.U
    let name = recIn.Bezeichnung
    let recOut = {
      vrv: '2015',
      grpnum: grpNum,
      name: name
    }

    // console.log('' + i + ' ' + recOut.grpnum + '=' + recOut.name)
    recOutAll.push(recOut)
  }
  console.log('Begin: Write ' + recOutAll.length + ' records to db.')
  const tableName = 'vrv_ansatzgruppe'
  await db(tableName).truncate()
  await db.batchInsert(tableName, recOutAll)
  console.log('End: Write to db.')
}  // eo main

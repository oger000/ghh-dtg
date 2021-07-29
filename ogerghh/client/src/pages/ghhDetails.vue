<template>
  <q-page>

    <GhhDetailsGrid
      v-bind="$props"
      :columns="columns"
      :detailUrl="detailUrl"
      :mvagUrl="mvagUrl"
    />

  </q-page>
</template>

<script>
// import { ref, onMounted } from 'vue'
import GhhDetailsGrid from 'components/GhhDetailsGrid.vue'


export default {
  components: {
    GhhDetailsGrid
  },

  props: {
    gemeinde: String,
    gkz: String,
    gemeinden_name: String,
    va_ra: String,
    finanzjahr: String,
    quartal: String,
    periode: String,
    nva: String,
    vrv: String,
    gemeinde_berichte_name: String,
    bestandteil: String,
    vrv_bestandteile_name: String
  },

  // compose component
  setup (props) {
    // alert('ehh: ' + JSON.stringify(props))

    let columns = []
    let detailUrl = ''
    let mvagUrl = ''

    switch (props.bestandteil) {
      case 'ergebnishaushalt':
        columns = [
          { name: 'dummy1', label: '[+]', field: '', align: 'left', required: false, sortable: false, style: 'width:5%' },
          { name: 'ansatz', label: 'Ansatz', field: 'ansatz_plus_text', align: 'left', required: true, sortable: false, style: 'width:30%' },
          { name: 'konto', label: 'Konto', field: 'konto_plus_text', align: 'left', required: true, sortable: false, style: 'width:30%' },
          { name: 'verguetung', label: 'Verg', field: 'verguetung_text', align: 'center', required: true, sortable: false, style: 'width:5%' }
        ]
        if (props.va_ra === 'VA') {
          columns = columns.concat([
            { name: 'wert1', label: `Voranschlag ${props.finanzjahr}`, field: 'wert1', align: 'right', sortable: false, style: 'width:10%' },
            { name: 'wert2', label: `Voranschlag ${props.finanzjahr - 1}`, field: 'wert2', align: 'right', sortable: false, style: 'width:10%' },
            { name: 'wert3', label: `Abschluss ${props.finanzjahr - 2}`, field: 'wert3', align: 'right', sortable: false, style: 'width:10%' }
          ])
        } else if (props.va_ra === 'RA') {
          columns = columns.concat([
            { name: 'wert1', label: `Abschluss ${props.finanzjahr}`, field: 'wert1', align: 'right', sortable: false, style: 'width:10%' },
            { name: 'wert2', label: `Voranschlag ${props.finanzjahr}`, align: 'right', sortable: false, style: 'width:10%' },
            { name: 'wert3', label: 'Abweichung', field: 'wert3', align: 'right', sortable: false, style: 'width:10%' }
          ])
        }
        detailUrl = 'ehh_details'
        mvagUrl = 'mvag_ehh'
        break
      case 'finanzierungshaushalt':
        columns = [
          { name: 'dummy1', label: '[+]', field: '', align: 'left', required: false, sortable: false },
          { name: 'ansatz', label: 'Ansatz', field: 'ansatz_plus_text', align: 'left', required: true, sortable: false },
          { name: 'konto', label: 'Konto', field: 'konto_plus_text', align: 'left', required: true, sortable: false },
          { name: 'verguetung', label: 'Verg', field: 'verguetung_text', align: 'center', required: true, sortable: false }
        ]
        if (props.va_ra === 'VA') {
          columns = columns.concat([
            { name: 'wert1', label: `Voranschlag ${props.finanzjahr}`, field: 'wert1', align: 'right', sortable: false },
            { name: 'wert2', label: `Voranschlag ${props.finanzjahr - 1}`, field: 'wert2', align: 'right', sortable: false },
            { name: 'wert3', label: `Abschluss ${props.finanzjahr - 2}`, field: 'wert3', align: 'right', sortable: false }
          ])
        } else if (props.va_ra === 'RA') {
          columns = columns.concat([
            { name: 'wert1', label: `Abschluss ${props.finanzjahr}`, field: 'wert1', align: 'right', sortable: false },
            { name: 'wert2', label: `Voranschlag ${props.finanzjahr}`, align: 'right', sortable: false },
            { name: 'wert3', label: 'Abweichung', field: 'wert3', align: 'right', sortable: false }
          ])
        }
        detailUrl = 'fhh_details'
        mvagUrl = 'mvag_fhh'
        break
      case 'vermoegenshaushalt':
        columns = [
          { name: 'dummy1', label: '[+]', field: '', align: 'left', required: false, sortable: false },
          { name: 'ansatz', label: 'Ansatz', field: 'ansatz_plus_text', align: 'left', required: true, sortable: false },
          { name: 'konto', label: 'Konto', field: 'konto_plus_text', align: 'left', required: true, sortable: false },
          { name: 'verguetung', label: '', field: 'verguetung_text', align: 'center', required: true, sortable: false },
          { name: 'wert1', label: `Wert 01.01.${props.finanzjahr}`, field: 'wert1', align: 'right', sortable: false },
          { name: 'wert2', label: `Wert 31.12.${props.finanzjahr}`, field: 'wert2', align: 'right', sortable: false },
          { name: 'wert3', label: 'Veränderung', field: 'wert3', align: 'right', sortable: false }
        ]
        detailUrl = 'vhh_details'
        mvagUrl = 'mvag_vhh'
    }

    // return responsive variables
    return {
      columns,
      detailUrl,
      mvagUrl
    }
  } // eo setup
} // eo export default

</script>

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
          { name: 'dummy1', label: 'x', field: '', align: 'left', required: false, sortable: false },
          { name: 'ansatz', label: 'Ansatz', field: 'ansatz_plus_text', align: 'left', required: true, sortable: false },
          { name: 'konto', label: 'Konto', field: 'konto_plus_text', align: 'left', required: true, sortable: false }
        ]
        if (props.va_ra === 'RA') {
          columns = columns.concat([
            { name: 'wert1', label: 'Wert RA', field: 'wert1', align: 'right', sortable: false, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) },
            { name: 'wert2', label: 'Wert VA', field: 'wert2', align: 'right', sortable: false, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) },
            { name: 'wert3', label: 'Abweichung', field: 'wert3', align: 'right', sortable: false, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) }
          ])
        }

        detailUrl = 'ehh_details'
        mvagUrl = 'mvag_ehh'
        break
      case 'finanzierungshaushalt':
        columns = [
          { name: 'ansatz', label: 'Ansatz', field: 'ansatz_text', align: 'left', required: true, sortable: false },
          { name: 'konto', label: 'Konto', field: 'konto_text', align: 'left', required: true, sortable: false },
          { name: 'wert', label: 'Wert', field: 'wert', align: 'right', sortable: false, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) },
          { name: 'wert_fj0', label: 'Wert Folgejahr', field: 'wert_fj0', align: 'right', sortable: false, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) }
        ]
        detailUrl = 'fhh_details'
        mvagUrl = 'mvag_fhh'
        break
      case 'vermoegenshaushalt':
        columns = [
          { name: 'mvag', label: 'MVAG', field: 'mvag_text', align: 'left', required: true, sortable: false },
          { name: 'ansatz', label: 'Ansatz', field: 'ansatz_text', align: 'left', required: true, sortable: false },
          { name: 'konto', label: 'Konto', field: 'konto_text', align: 'left', required: true, sortable: false },
          { name: 'endstand_vj', label: 'Wert 01.01.', field: 'endstand_vj', align: 'right', sortable: false, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) },
          { name: 'endstand_rj', label: 'Wert 31.12.', field: 'endstand_rj', align: 'right', sortable: false, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) }
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

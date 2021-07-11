<template>
  <q-page>

    <ghh-details v-bind="$props" />

  </q-page>
</template>

<script>
// import { ref, onMounted } from 'vue'
import GhhDetails from 'components/GhhDetails.vue'
/*
const tableColumns = [
  { name: 'ansatz', label: 'Ansatz', field: 'ansatz_text', align: 'left', required: true, sortable: true },
  { name: 'konto', label: 'Konto', field: 'konto_text', align: 'left', required: true, sortable: true },
  { name: 'wert', label: 'Wert', field: 'wert', align: 'right', sortable: true, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) },
  { name: 'wert_fj0', label: 'Wert Folgejahr', field: 'wert_fj0', align: 'right', sortable: true, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) }
]
*/
export default {
  components: {
    GhhDetails
  },

  props: [
    'gemeinde',
    'gkz',
    'gemeinden_name',
    'va_ra',
    'finanzjahr',
    'quartal',
    'periode',
    'nva',
    'vrv',
    'gemeinde_berichte_name',
    'bestandteil',
    'vrv_bestandteile_name'
  ],

  // compose component
  setup (props) {
    // return responsive variables
    return {}
  } // eo setup
} // eo export default

</script>

<template>
  <q-page>

    <GhhDetails
      v-bind="$props"
      :columns="columns"
      detailUrl="vhh_details"
    />

  </q-page>
</template>

<script>
// import { ref, onMounted } from 'vue'
import GhhDetails from 'components/GhhDetails.vue'

const columns = [
  { name: 'ansatz', label: 'Ansatz', field: 'ansatz_text', align: 'left', required: true, sortable: true },
  { name: 'konto', label: 'Konto', field: 'konto_text', align: 'left', required: true, sortable: true },
  { name: 'endstand_vj', label: 'Wert 01.01.', field: 'endstand_vj', align: 'right', sortable: true, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) },
  { name: 'endstand_rj', label: 'Wert 31.12.', field: 'endstand_rj', align: 'right', sortable: true, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) }
]

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
    // alert('ehh: ' + JSON.stringify(columns))

    // return responsive variables
    return {
      columns
    }
  } // eo setup
} // eo export default

</script>

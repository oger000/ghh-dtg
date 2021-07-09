<template>
  <q-page>

    <q-toolbar  class="bg-primary text-white">
      <q-btn flat dense round fab
        icon="arrow_back"
        @click="$router.back()"
      />
      <q-toolbar-title class="text-center">
        {{ mainTitle }}
      </q-toolbar-title>
    </q-toolbar>

    <q-table
     :rows="tableData"
     :columns="columns"
     row-key="iid"
     v-model:pagination="serverPagination"
     @request="fetchRowsAndTotal"
     binary-state-sort
    >
    </q-table>

  </q-page>
</template>

<script>
import { ref, onMounted } from 'vue'
// import { Dialog } from 'quasar'
import api from '../lib/axios'
import { axiosError, prepPagingParams } from '../lib/ogerlib'


const columns = [
  { name: 'ansatz', label: 'Ansatz', field: 'ansatz_text', align: 'left', required: true, sortable: true },
  { name: 'konto', label: 'Konto', field: 'konto_text', align: 'left', required: true, sortable: true },
  { name: 'wert', label: 'Wert', field: 'wert', align: 'right', sortable: true, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) },
  { name: 'wert_fj0', label: 'Wert Folgejahr', field: 'wert_fj0', align: 'right', sortable: true, format: (val) => parseFloat(val).toLocaleString('de-DE', { minimumFractionDigits: 2, useGrouping: true }) }
]

export default {
  props: [
    'gemeindeName',
    'berichtName',
    'bestandteilName'
  ],


  // compose component
  setup (props) {
    // debugger
    // alert(JSON.stringify(props))
    const tableData = ref([])
    // const filter = ref('')
    const loading = ref(false)
    const serverPagination = ref({
      sortBy: 'iid',
      descending: false,
      page: 1,
      rowsPerPage: 30,
      rowsNumber: 1
    })

    const mainTitle = ref(`${props.gemeindeName} / ${props.berichtName} / ${props.bestandteilName}`)

    // fetch rows from server
    async function fetchRowsAndTotal (serverOpts) {
      const { page, rowsPerPage, sortBy, descending } = serverOpts.pagination
      // const filter = props.filter
      loading.value = true

      try {
        const requestParams = prepPagingParams(serverOpts)
        const { data } = await api.post('api/navi/ehh_details', requestParams)
        tableData.value = data.rows
        serverPagination.value.rowsNumber = data.total
      } catch (error) {
        axiosError(error)
      }
      // don't forget to update local pagination object and turn off loading indicator
      serverPagination.value.page = page
      serverPagination.value.rowsPerPage = rowsPerPage
      serverPagination.value.sortBy = sortBy
      serverPagination.value.descending = descending
      loading.value = false
    }

    onMounted(() => {
      // get initial data from server (1st page)
      fetchRowsAndTotal({
        pagination: serverPagination.value
      })
    })

    return {
      mainTitle,
      // filter,
      loading,
      serverPagination,
      columns,
      tableData,
      fetchRowsAndTotal
    }
  } // eo setup
} // eo export default

</script>

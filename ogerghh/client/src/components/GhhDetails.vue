<template>
  <div>

    <q-toolbar  class="bg-primary text-white">
      <q-btn flat dense round fab
        icon="arrow_back"
        @click="$router.back()"
      />
      <q-toolbar-title class="text-center">
        {{ mainTitle }}
      </q-toolbar-title>
    </q-toolbar>

    <div class="row q-gutter-md">

      <q-select
        filled
        clearable
        use-input
        v-model="selectMvagValue"
        label="MVAG-Filter"
        :options="selectMvagOptions"
        @filter="onSelectMvagFilter"
        @update:model-value="onSelectMvagUpdate"
        style="width: 250px"
      >
      </q-select>

      <q-select
        filled
        clearable
        use-input
        v-model="selectAnsatzValue"
        label="Ansatzfilter"
        :options="selectAnsatzOptions"
        @filter="onSelectAnsatzFilter"
        @update:model-value="onSelectAnsatzUpdate"
        style="width: 250px"
      >
      </q-select>

      <q-select
        filled
        clearable
        use-input
        v-model="selectKontoValue"
        label="Kontofilter"
        :options="selectKontoOptions"
        @filter="onSelectKontoFilter"
        @update:model-value="onSelectKontoUpdate"
        style="width: 250px"
      >
      </q-select>
    </div>

    <q-table
      dense
     :rows="tableData"
     :columns="tableColumns"
     row-key="iid"
     :filter="tableFilter"
     v-model:pagination="serverPagination"
     @request="fetchRowsAndTotal"
     binary-state-sort
    />

  </div>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue'
// import { Dialog } from 'quasar'
import api from '../lib/axios'
import { axiosError, prepPagingParams } from '../lib/ogerlib'


export default defineComponent({
  name: 'GhhDetails',

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
    vrv_bestandteile_name: String,
    columns: Array,
    detailUrl: String,
    mvagUrl: String
  },

  // compose component
  setup (props) {
    // debugger
    // alert('props-in: ' + JSON.stringify(props))

    const mainTitle = ref(`${props.gemeinden_name} / ${props.gemeinde_berichte_name} / ${props.vrv_bestandteile_name}`)

    // ---------------------------------------------------
    // fetch rows from server
    const tableData = ref([])
    const tableFilter = ref('')
    const loading = ref(false)
    const serverPagination = ref({
      sortBy: 'iid',
      descending: false,
      page: 1,
      rowsPerPage: 30,
      rowsNumber: 1
    })

    async function fetchRowsAndTotal (serverOpts) {
      // alert(JSON.stringify(serverOpts))
      const { page, rowsPerPage, sortBy, descending } = serverOpts.pagination
      // const filter = props.filter

      const requestParams = prepPagingParams(serverOpts)
      requestParams.baseFilter = {
        gkz: props.gkz,
        va_ra: props.va_ra,
        finanzjahr: props.finanzjahr,
        quartal: props.quartal,
        nva: props.nva,
        vrv: props.vrv
      }
      // alert('1: ' + JSON.stringify(selectAnsatzValue))
      // alert('2: ' + JSON.stringify(selectAnsatzValue.value))
      requestParams.filter = {
        mvag: (selectMvagValue.value ? selectMvagValue.value.value : undefined),
        ansatz: (selectAnsatzValue.value ? selectAnsatzValue.value.value : undefined),
        konto: (selectKontoValue.value ? selectKontoValue.value.value : undefined)
      }

      try {
        loading.value = true
        const { data } = await api.post(`api/navi/${props.detailUrl}`, requestParams)
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


    // -----------------------------------------------
    // mvag selection
    const selectMvagValue = ref(null)
    const selectMvagOptions = ref(null)
    let allSelectMvagOptions = null

    async function onSelectMvagFilter (val, update, abort) {
      // load opts from db
      if (allSelectMvagOptions === null) {
        try {
          const { data } = await api.post(`api/navi/select_${props.mvagUrl}`, { vrv: props.vrv })
          update(() => {
            selectMvagOptions.value = data.rows
            allSelectMvagOptions = [...data.rows]
          })
        } catch (error) {
          abort()
          axiosError(error)
        }
        return
      } // eo load opts

      update(() => {
        // alert('val: ' + JSON.stringify(val)
        const needle = val.toLowerCase()
        selectMvagOptions.value = allSelectMvagOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    } // eo filter mvag selection

    async function onSelectMvagUpdate (val) {
      // alert('onSelectMvagUpdate: ' + JSON.stringify(val))
      tableFilter.value = 'mvag: ' + JSON.stringify(val)
    } // eo mvagfilter selected


    // -----------------------------------------------
    // ansatz selection
    const selectAnsatzValue = ref(null)
    const selectAnsatzOptions = ref(null)
    let allSelectAnsatzOptions = null

    async function onSelectAnsatzFilter (val, update, abort) {
      // load opts from db
      if (allSelectAnsatzOptions === null) {
        try {
          const { data } = await api.post('api/navi/select_ansatz', { vrv: props.vrv })
          update(() => {
            selectAnsatzOptions.value = data.rows
            allSelectAnsatzOptions = [...data.rows]
          })
        } catch (error) {
          abort()
          axiosError(error)
        }
        return
      } // eo load opts

      update(() => {
        // alert('val: ' + JSON.stringify(val)
        const needle = val.toLowerCase()
        selectAnsatzOptions.value = allSelectAnsatzOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    } // eo filter ansatz selection

    async function onSelectAnsatzUpdate (val) {
      // alert('onSelectAnsatzUpdate: ' + JSON.stringify(val))
      tableFilter.value = 'ansatz: ' + JSON.stringify(val)
    } // eo ansatzfilter selected

    // -----------------------------------------------
    // konto selection
    const selectKontoValue = ref(null)
    const selectKontoOptions = ref(null)
    let allSelectKontoOptions = null

    async function onSelectKontoFilter (val, update, abort) {
      // load opts from db
      if (allSelectKontoOptions === null) {
        try {
          const { data } = await api.post('api/navi/select_konto', { vrv: props.vrv })
          update(() => {
            selectKontoOptions.value = data.rows
            allSelectKontoOptions = [...data.rows]
          })
        } catch (error) {
          abort()
          axiosError(error)
        }
        return
      } // eo load opts

      update(() => {
        // alert('val: ' + JSON.stringify(val)
        const needle = val.toLowerCase()
        selectKontoOptions.value = allSelectKontoOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    } // eo filter konto selection

    async function onSelectKontoUpdate (val) {
      // alert('onSelectKontoUpdate: ' + JSON.stringify(val))
      tableFilter.value = 'konto: ' + JSON.stringify(val)
    } // eo kontofilter selected

    // return responsive variables
    return {
      mainTitle,
      // filter,
      loading,
      serverPagination,
      tableColumns: props.columns,
      tableData,
      fetchRowsAndTotal,
      tableFilter,
      selectMvagValue,
      selectMvagOptions,
      onSelectMvagFilter,
      onSelectMvagUpdate,
      selectAnsatzValue,
      selectAnsatzOptions,
      onSelectAnsatzFilter,
      onSelectAnsatzUpdate,
      selectKontoValue,
      selectKontoOptions,
      onSelectKontoFilter,
      onSelectKontoUpdate
    }
  } // eo setup
}) // eo export default

</script>

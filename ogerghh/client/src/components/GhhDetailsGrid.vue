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
        grid
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

      <q-input bottom-slots v-model="filterText" label="Textfilter" dense @keydown.enter.prevent="onFilterTextApply(filterText)" filled>
        <template v-slot:append>
          <q-icon v-if="filterText !== ''" name="close" @click="filterText = ''" class="cursor-pointer" />
        </template>
        <template v-slot:after>
          <q-btn round dense flat icon="send" @click="onFilterTextApply(filterText)" />
        </template>
      </q-input>

      <q-select
        filled
        v-model="selectSort"
        map-options
        label="Sortierung"
        :options="[
          {
            label: 'Ansatz, Konto', value: 'ansatz'
          },
          {
            label: 'Konto, Ansatz', value: 'konto'
          }
        ]"
        @update:model-value="onSelectSort"
        style="width: 200px"
      >
      </q-select>

    </div>

    <q-table
      grid
      grid-header
      dense
     :rows="tableData"
     :columns="tableColumns"
     row-key="iid"
     :filter="tableFilter"
     v-model:pagination="serverPagination"
     @request="fetchRowsAndTotal"
     binary-state-sort
    >

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th class="text-center" style="width:5%">
            {{ props.cols[0].label }}
          </q-th>
          <q-th class="text-left" style="width:30%">{{ props.cols[1].label }}</q-th>
          <q-th class="text-left" style="width:30%">{{ props.cols[2].label }}</q-th>
          <q-th class="text-center" style="width:5%">{{ props.cols[3].label }}</q-th>
          <q-th class="text-right" style="width:10%">{{ props.cols[4].label }}</q-th>
          <q-th class="text-right" style="width:10%">{{ props.cols[5].label }}</q-th>
          <q-th class="text-right" style="width:10%">{{ props.cols[6].label }}</q-th>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-12col-md-12">
          <!--
          <q-card>
            <q-card-section class="text-center">
              Werte für
              <br>
              <strong>{{ props.row.label }}</strong>
            </q-card-section>
            <q-separator />
            <q-card-section class="flex flex-center">
              <div>{{ props.row.wert_fj0 }} g</div>
            </q-card-section>
          </q-card>
          -->
          <q-markup-table
            separator="cell"
          >
            <tbody>
              <tr>
                <td class="text-left" style="width:5%">
                  <q-btn
                    round dense
                    :icon="expanded1.indexOf(props.row.iid) === -1 ? 'add' : 'remove'"
                    @click="expanded1.indexOf(props.row.iid) === -1 ? expanded1.push(props.row.iid) : expanded1.splice(expanded1.indexOf(props.row.iid), 1)"
                  />
                </td>
                <td class="text-left" style="width:30%">{{ props.row.ansatz_plus_text }}</td>
                <td class="text-left" style="width:30%">{{ props.row.konto_plus_text }}</td>
                <td class="text-center" style="width:5%">{{ props.row.verguetung_text }}</td>
                <td class="text-right" style="width:10%">{{ props.row.wert1 }}</td>
                <td class="text-right" style="width:10%">{{ props.row.wert2 }}</td>
                <td class="text-right" style="width:10%">{{ props.row.wert3 }}</td>
              </tr>
              <tr :hidden="expanded1.indexOf(props.row.iid) === -1">
                <td colspan="6">
                  <q-markup-table>
                    <tbody>
                      <tr>
                        <td class="text-left">Finanzjahr</td>
                        <td class="text-right">{{ props.row.finanzjahr }}</td>
                        <td class="text-right">{{ props.row.finanzjahr - 1 }}</td>
                        <td class="text-right">{{ props.row.finanzjahr - 2 }}</td>
                        <td class="text-right">{{ props.row.finanzjahr - 3 }}</td>
                        <td class="text-right">{{ props.row.finanzjahr - 4 }}</td>
                        <td class="text-right">{{ props.row.finanzjahr - 5 }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">Rechnungsabschluss</td>
                        <td class="text-right">{{ props.row.wert_ra_vj0 }}</td>
                        <td class="text-right">{{ props.row.wert_ra_vj1 }}</td>
                        <td class="text-right">{{ props.row.wert_ra_vj2 }}</td>
                        <td class="text-right">{{ props.row.wert_ra_vj3 }}</td>
                        <td class="text-right">{{ props.row.wert_ra_vj4 }}</td>
                        <td class="text-right">{{ props.row.wert_ra_vj5 }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">Voranschlag</td>
                        <td class="text-right">{{ props.row.wert_va_vj0 }}</td>
                        <td class="text-right">{{ props.row.wert_va_vj1 }}</td>
                        <td class="text-right">{{ props.row.wert_va_vj2 }}</td>
                        <td class="text-right">{{ props.row.wert_va_vj3 }}</td>
                        <td class="text-right">{{ props.row.wert_va_vj4 }}</td>
                        <td class="text-right">{{ props.row.wert_va_vj5 }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </td>
              </tr>
              <tr :hidden="expanded1.indexOf(props.row.iid) === -1">
                <td colspan="6">
                  <q-markup-table>
                    <tbody>
                      <tr>
                        <td class="text-left">{{ props.row.ansatz1_plus_text }}</td>
                        <td class="text-left">{{ props.row.konto1_plus_text }}</td>
                        <td class="text-left">{{ props.row.mvag1_plus_text }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">{{ props.row.ansatz2_plus_text }}</td>
                        <td class="text-left">{{ props.row.konto2_plus_text }}</td>
                        <td class="text-left">{{ props.row.mvag2_plus_text }}</td>
                      </tr>
                      <tr>
                        <td class="text-left">{{ props.row.ansatz3_plus_text }}</td>
                        <td class="text-left">{{ props.row.konto3_plus_text }}</td>
                        <td class="text-left">{{ props.row.id_xhh }}</td>
                        <td class="text-left">&nbsp;</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </template>
    </q-table>

  </div>
</template>

<script>
import { ref, onMounted, defineComponent } from 'vue'
// import { Dialog } from 'quasar'
import api from '../lib/axios'
import { axiosError, prepPagingParams } from '../lib/ogerlib'


export default defineComponent({
  name: 'GhhDetailsGrid',

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
      sortBy: '',
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
      requestParams.filter = {
        mvag: (selectMvagValue.value ? selectMvagValue.value.value : undefined),
        ansatz: (selectAnsatzValue.value ? selectAnsatzValue.value.value : undefined),
        konto: (selectKontoValue.value ? selectKontoValue.value.value : undefined),
        filterText: (filterText.value ? filterText.value : undefined)
      }
      requestParams.sort = [[selectSort.value.value, 'ASC']]

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
        const needle = val.toLowerCase()
        selectMvagOptions.value = allSelectMvagOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    } // eo filter mvag selection

    async function onSelectMvagUpdate (val) {
      // fake filter change
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
        const needle = val.toLowerCase()
        selectAnsatzOptions.value = allSelectAnsatzOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    } // eo filter ansatz selection

    async function onSelectAnsatzUpdate (val) {
      // fake filter change
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
        const needle = val.toLowerCase()
        selectKontoOptions.value = allSelectKontoOptions.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    } // eo filter konto selection

    async function onSelectKontoUpdate (val) {
      // fake filter change
      tableFilter.value = 'konto: ' + JSON.stringify(val)
    } // eo kontofilter selected

    // -----------------------------------------------
    // expand collapse details

    const expanded1 = ref([])
    const expanded2 = ref([])


    // -----------------------------------------------
    // textfilter

    const filterText = ref('')

    async function onFilterTextApply (val) {
      // fake filter change
      tableFilter.value = 'text: ' + JSON.stringify(val)
    } // eo textfilter apply


    // -----------------------------------------------
    // sort
    const selectSort = ref('ansatz')

    async function onSelectSort (val) {
      // fake sort change via filter change
      tableFilter.value = 'sort: ' + JSON.stringify(val)
      // selectSort.value = val
    } // eo textfilter apply




    // -----------------------------------------------
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
      onSelectKontoUpdate,
      expanded1,
      expanded2,
      filterText,
      onFilterTextApply,
      selectSort,
      onSelectSort
    }
  } // eo setup
}) // eo export default

</script>

<template>
  <q-page>

    <q-toolbar  class="bg-primary text-white">
      <q-btn flat dense round fab
        icon="arrow_back"
        @click="$router.back()"
      />

      <q-toolbar-title class="text-center">
        {{ bestandteil_name }}
      </q-toolbar-title>

    </q-toolbar>

  </q-page>
</template>

<script>
// import { toRef } from 'vue'
// import { Dialog } from 'quasar'
// import api from '../lib/axios'
// import { axiosError } from '../lib/ogerlib'

/*
// fetch prep request opts
function prepReqOpts() {

} // eo prep req opts
*/

export default {
  props: [
    'bestandteil_name'
  ],

  // compose component
  setup (props) {
    // alert(JSON.stringify(props))
    return {
    }
  } // eo setup
} // eo export default

</script>

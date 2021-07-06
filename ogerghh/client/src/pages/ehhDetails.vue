<template>
  <q-page>

    <q-toolbar  class="bg-primary text-white">
      <q-btn flat dense round fab
        icon="back"
        @click="$router.back()"
      />

      <q-toolbar-title class="text-center">
        {{ toolbarTitle }} ERGEBNISHAUSHALT
      </q-toolbar-title>

    </q-toolbar>

    <div class="q-pa-md q-gutter-sm">
      <q-tree
        :nodes="nodes"
        default-expand-all
        node-key="key"
        label-key="name"
        @lazy-load="onLazyLoad"
        tick-strategy="strict"
      />
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { Dialog } from 'quasar'
import api from '../lib/axios'
import { axiosError } from '../lib/ogerlib'

const nodes = [
  {
    name: 'DETAILS',
    key: 'R1',
    lazy: true,
    rec: {},
    nextLevel: 'gemeinden',
    noTick: true
  }
]

/*
// fetch prep request opts
function prepReqOpts() {

} // eo prep req opts
*/

export default {

  // compose component
  setup () {
    return {
      nodes: ref(nodes),

      async onLazyLoad ({ node, key, done, fail }) {
        // call fail() if any error occurs

        let reqOpts = {}
        let afterNextLevel = ''
        switch (node.nextLevel) {
          case 'gemeinden':
            reqOpts = {}
            afterNextLevel = 'gemeinde_jahre'
            break
          case 'gemeinde_jahre':
            reqOpts = {
              gkz: node.rec.gkz
            }
            afterNextLevel = 'vrv_bestandteile'
            break
          case 'vrv_bestandteile':
            reqOpts = {
              vrv: node.rec.vrv
            }
            afterNextLevel = 'bestandteil_details'
            break
          case 'bestandteil_details': {
            reqOpts = {
              vrv: node.rec.vrv,
              bestandteil: node.rec.bestandteil
            }
            /*
            let children
            if (!node.rec.bestandteil_metagliederung) {
              switch (node.rec.bestandteil) {
                case 'ergebnishaushalt':
                  children = [
                    {
                      name: 'nach Gliederung',
                      key: `${node.key}_ANS`,
                      lazy: true,
                      rec: Object.assign({}, node.rec, { bestandteil_metagliederung: 'ANSATZ' }),
                      nextLevel: 'bestandteil_details'
                    },
                    {
                      name: 'nach Ansatz',
                      key: `${node.key}_ANS`,
                      lazy: true,
                      rec: Object.assign({}, node.rec, { bestandteil_metagliederung: 'ANSATZ' }),
                      nextLevel: 'bestandteil_details'
                    }
                  ]
              }
              if (children) {
                done(children)
                return
              }
            }
            */
            afterNextLevel = 'bestandteil_details'
            break
          }
          default: {
            Dialog.create({
              title: 'Fehler',
              message: `Unbekannte Folgeebene: ${node.nextLevel}`,
              ok: true
            })
            fail()
          }
        } // eo case

        const children = []
        let resp
        try {
          const url = `api/navi/${node.nextLevel}`
          resp = await api.post(url, reqOpts)
        } catch (error) {
          axiosError(error)
          fail()
          return
        }
        for (const rec of resp.data.rows) {
          const child = {
            name: rec.name,
            key: `${node.key}_${rec.iid}`,
            lazy: true,
            rec: Object.assign({}, node.rec, rec),
            nextLevel: afterNextLevel
          }
          children.push(child)
        }

        done(children)
      } // eo on lazy load
    } // eo setup-return
  } // eo setup
} // eo export default

</script>

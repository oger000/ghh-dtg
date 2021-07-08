<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-tree
        :nodes="nodes"
        default-expand-all
        node-key="key"
        label-key="name"
        @lazy-load="onLazyLoad"
      />
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { Dialog } from 'quasar'
import api from '../lib/axios'
import { axiosError } from '../lib/ogerlib'
import { useRouter } from 'vue-router'

const nodes = [
  {
    name: 'Gemeinden',
    key: 'R1',
    lazy: true,
    rec: {},
    nextLevel: 'gemeinden'
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
    const router = useRouter()

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
            node.rec.bestandteil_name = node.name
            switch (node.rec.bestandteil) {
              case 'ergebnishaushalt':
                router.push({ name: 'ehhDetails', params: node.rec })
                fail()
                return
              default: {
                Dialog.create({
                  title: 'Fehler',
                  message: `Details für unbekannten Bestanteil '${node.nextLevel}' angefordert.`,
                  ok: true
                })
                fail()
                return
              }
            } // eo case
          }
          default: {
            Dialog.create({
              title: 'Fehler',
              message: `Unbekannte Folgeebene: ${node.nextLevel}`,
              ok: true
            })
            fail()
            return
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

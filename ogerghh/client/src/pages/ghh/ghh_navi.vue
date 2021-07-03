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
import { axiosError } from '../../lib/ogerlib.js'

const nodes = [
  {
    name: 'Gemeinden',
    key: 'ROOT_GEMEINDEN',
    lazy: true,
    nextLevel: 'gemeinden'
  }
]

export default {
  data: () => ({
    nodes: ref(nodes)
  }),
  methods: {
    async onLazyLoad ({ node, key, done, fail }) {
      // call fail() if any error occurs

      const children = []
      let resp
      switch (node.nextLevel) {
        case 'gemeinden':
          try {
            resp = await this.$axios.post('api/ghh/gemeinden')
          } catch (error) {
            axiosError(error)
            // fail(error)
            return
          }
          for (const rec of resp.data.rows) {
            children.push({
              name: `${rec.gemeinde} (${rec.gkz})`,
              key: rec.iid,
              lazy: true,
              rec: rec,
              nextLevel: 'gemeinde_jahre'
            })
          }
          break

        case 'gemeinde_jahre':
          try {
            resp = await this.$axios.post('api/ghh/gemeinde_jahre', { gkz: node.gkz })
          } catch (error) {
            axiosError(error)
            // fail(error)
            return
          }
          for (const rec of resp.data.rows) {
            const vaRaText = (rec.va_ra === 'RA' ? 'Rechnungsabschluss' : (rec.va_ra === 'VA' ? 'Voranschlag' : 'Unbekannt'))
            children.push({
              name: `${rec.finanzjahr}/${rec.quartal} ${vaRaText} (VRV ${rec.vrv})`,
              key: `${node.key}_${rec.iid}`,
              lazy: true,
              rec: Object.assign({}, node.rec, rec),
              nextLevel: 'vrv_bestandteile'
            })
          }
          break

        case 'vrv_bestandteile':
          try {
            resp = await this.$axios.post('api/ghh/vrv_bestandteile', { vrv: node.vrv })
          } catch (error) {
            axiosError(error)
            // fail(error)
            return
          }
          for (const rec of resp.data.rows) {
            rec.bestandteil = rec.name
            children.push({
              name: rec.dispname,
              key: `${node.key}_${rec.iid}`,
              lazy: true,
              rec: Object.assign({}, node.rec, rec),
              nextLevel: 'bestandteil_gliederung'
            })
          }
          break

        case 'bestandteil_gliederung':
          try {
            resp = await this.$axios.post('api/ghh/bestandteil_gliederung', { vrv: node.rec.vrv, bestandteil: node.rec.bestandteil })
          } catch (error) {
            axiosError(error)
            // fail(error)
            return
          }
          for (const rec of resp.data.rows) {
            children.push({
              name: JSON.stringify(rec),
              key: `${node.key}_${rec.iid}`,
              lazy: true,
              rec: Object.assign({}, node.rec, rec),
              nextLevel: 'gliederung_details'
            })
          }
          break

        default: {
          const msg = `Unbekannte Folgeebene: ${node.nextLevel}`
          fail()
          Dialog.create({
            title: 'Fehler',
            message: msg,
            ok: true
          })
        }
      } // eo case

      done(children)
    } // eo on lazy load
  } // eo setup-return
} // eo export default

</script>

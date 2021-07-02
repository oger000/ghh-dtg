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

      let children = []
      switch (node.nextLevel) {
        case 'gemeinden':
          try {
            children = await this.$axios.post('api/ghh/gemeinden')
          } catch (error) {
            axiosError(error)
          }
          break
        default:
          fail('Unbekannte Folgeknoten: ' + node.nextLevel)
      } // eo case

      done(children)
    } // eo on lazy load
  } // eo setup-return
} // eo export default

</script>

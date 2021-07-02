<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
        <q-tree
          :nodes="nodes"
          default-expand-all
          node-key="key"
          label-key="label"
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
    nextlevel: 'gemeinden'
  }
]

export default {
  name: 'ghh_navi',
  setup () {
    return {
      nodes: ref(nodes),

      async onLazyLoad ({ node, key, addChildren, fail }) {
        // call fail() if any error occurs

        let children = []
        switch (node.nextLevel) {
          case 'gemeinden':
            try {
              children = await this.$api.post('ghh/gemeinden')
            } catch (error) {
              axiosError(error)
            }
            break
          default:
            fail('Unbekannte Folgeknoten: ' + node.nextLevel)
        } // eo case

        addChildren(children)
      } // eo on lazy load
    } // eo setup-return
  } // eo setup
} // eo export default

</script>

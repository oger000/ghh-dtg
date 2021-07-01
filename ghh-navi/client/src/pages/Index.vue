<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
        <q-tree
          :nodes="nodes"
          default-expand-all
          node-key="label"
          @lazy-load="onLazyLoad"
        />
      </div>
    </q-page>
</template>

<script>
import { ref } from 'vue'

const nodes = [
  {
    label: 'Gemeinde',
    lazy: true
  }
]

export default {
  name: 'PageIndex',
  setup () {
    return {
      nodes: ref(nodes),

      onLazyLoad ({ node, key, done, fail }) {
        // call fail() if any error occurs

        done([
          {
            label: 'Horn',
            lazy: true
          }
        ])
      }
    }
  }
} // eo export default

</script>

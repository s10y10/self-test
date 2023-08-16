<template>
  <div :class="[`item-${item.type}`]" :id="item.id" :style="item.style">
    <div v-if="isTextItem" class="content-box">
      <div class="content" v-html="item.content"></div>
    </div>
    <div v-else class="content" v-html="item.content"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { ITEM_TYPE } from '@/const/item-type'

export default defineComponent({
  props: ['item'],
  setup(prop) {
    const isTextItem = computed(() => {
      return prop.item.type === ITEM_TYPE.TEXT
    })
    return {
      isTextItem
    }
  }
})
</script>

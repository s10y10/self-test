<template>
  <div class="root" :style="rootStyle">
    <question-layer></question-layer>
    <head-layer></head-layer>
    <star-animation-layer></star-animation-layer>
    <result-layer></result-layer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick, computed, watchEffect } from 'vue'
import QuestionLayer from './components/layer/QuestionLayer.vue'
import StarAnimationLayer from './components/layer/StarAnimationLayer.vue'
import ResultLayer from './components/layer/ResultLayer.vue'
import HeadLayer from './components/layer/HeadLayer.vue'
import store from './js/store'

export default defineComponent({
  components: {
    QuestionLayer,
    StarAnimationLayer,
    ResultLayer,
    HeadLayer
  },
  setup() {
    const rootStyle = ref({
      width: '0px',
      height: '0px',
      transform: 'scale(1)'
    })

    const activityData: any = computed(() => {
      return store.state.activityData
    })

    const stageWidth = 1920
    const stageHeight = 1080
    const onResize = () => {
      nextTick(() => {
        rootStyle.value.width = `${stageWidth}px`
        rootStyle.value.height = `${stageHeight}px`
        const xScale = document.body.clientWidth / stageWidth
        const yScale = document.body.clientHeight / stageHeight
        const scale = Math.min(xScale, yScale)
        store.state.stageScale = scale
        rootStyle.value.transform = `scale(${scale}) translate(-50%, -50%)`
      })
    }

    onMounted(() => {
      window.addEventListener('resize', onResize)
    })

    watchEffect(() => {
      if (activityData.value) {
        onResize()
      }
    })

    return {
      rootStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.root {
  position: absolute;
  background: transparent;
  left: 50%;
  top: 50%;
  transform-origin: left top;
}
</style>

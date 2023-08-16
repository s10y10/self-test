<template>
  <div class="head-layer">
    <div class="top-bar"></div>
    <div class="question-type">拖拽题</div>
    <div class="star-container">
      <img class="star" v-for="(result, idx) in answerResult" :key="idx" :src="`${publicPath}assets/star_${result}.png`" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import store from '../../js/store'

export default defineComponent({
  setup() {
    const publicPath = ref('./')

    const answerResult = computed(() => {
      return store.state.answerResult
    })
    return {
      answerResult,
      publicPath
    }
  }
})
</script>

<style lang="scss" scoped>
.head-layer {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  pointer-events: none;
  .top-bar {
    width: 100%;
    height: 92px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .question-type {
    position: absolute;
    left: 0px;
    top: 40px;
    min-width: 240px;
    height: 80px;
    padding: 0px 54px;
    border-radius: 0 100px 100px 0px;
    background: rgba(20, 20, 20, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 40px;
    font-weight: bold;
  }
  .star-container {
    position: absolute;
    right: 40px;
    .star {
      margin-right: 6px;
    }
  }
}
</style>

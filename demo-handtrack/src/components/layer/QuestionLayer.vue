<template>
  <div class="question-layer">
    <template v-for="(question, idx) in questionList" :key="question.id">
      <drag-question v-show="currentQuestionIndex === idx" :class="['question']" :id="question.id" :question="question" :style="{ background: backgroundStyle(question) }"></drag-question>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import store from '../../js/store'
import { isHEX } from '@/tools/test-color'
import DragQuestion from '../question/drag/Index.vue'

export default defineComponent({
  components: {
    DragQuestion
  },
  setup() {
    const activityData: any = computed(() => {
      return store.state.activityData
    })

    const currentQuestionIndex = computed(() => {
      return store.state.currentQuestionIndex
    })

    const questionList = computed(() => {
      return activityData.value.questionList
    })

    const backgroundStyle = question => {
      let background = question.displayContent.background
      background = background = background ? (isHEX(background) ? background : `url(${background}) no-repeat left top/100% 100%`) : ''
      return background
    }

    return {
      questionList,
      currentQuestionIndex,
      backgroundStyle
    }
  }
})
</script>

<style lang="scss" scoped>
.question-layer {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
}
</style>

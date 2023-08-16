<template>
  <div class="drag-question">
    <div class="drag-question-layer">
      <template v-for="item in items" :key="item.id">
        <div v-if="isDragItem(item) && answerType === 1" :id="item.id" :class="[dragItemClass(item), item.opClass]" :style="item.style">
          <div class="content">
            <div class="wrap" v-html="item.content"></div>
          </div>
        </div>
        <div v-else-if="isDragItem(item) && answerType !== 1" :id="item.id" :class="[dragItemClass(item), item.opClass]" :style="item.style">
          <div class="content">
            <img v-if="item.content" :src="item.content" />
          </div>
        </div>
        <common-item v-else :item="item"></common-item>
      </template>
    </div>

    <common-commit-layer :canCommit="canCommit" :canReset="canReset" v-on:commit="onCommitHandler" v-on:reset="onResetHandler"></common-commit-layer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, getCurrentInstance } from 'vue'
import { ITEM_TYPE } from '@/const/item-type'
import questionMixin from '../mixin'
import CommonCommitLayer from '../../commit/CommonCommitLayer.vue'
import DragQuestionControl from './control'

export default defineComponent({
  mixins: [questionMixin],
  props: ['question'],
  components: {
    CommonCommitLayer
  },
  setup(props) {
    const control = new DragQuestionControl()

    const canCommit = ref(false)
    const canReset = ref(false)

    onMounted(() => {
      const { proxy } = getCurrentInstance() as any
      control.install(props.question, proxy)
    })

    const items = computed(() => {
      return props.question.displayContent.items
    })
    const answerType = computed(() => {
      return props.question.answerContent.answerType
    })
    const DRAG_ITEM_TYPE = [ITEM_TYPE.DRAG_OPTION, ITEM_TYPE.DRAG_PLACE]
    const isDragItem = item => {
      return DRAG_ITEM_TYPE.includes(item.type)
    }
    const dragItemClass = item => {
      return item.type === ITEM_TYPE.DRAG_OPTION ? 'drag-option' : 'drag-place'
    }

    const onCommitHandler = () => {
      if (canCommit.value) {
        control.commitAnswer(props.question)
        canCommit.value = false
      }
    }

    const onResetHandler = () => {
      if (canReset.value) {
        control.resetQuestionData(props.question)
        canCommit.value = false
        canReset.value = false
      }
    }

    return {
      items,
      isDragItem,
      dragItemClass,
      ITEM_TYPE,
      answerType,
      canCommit,
      canReset,
      onCommitHandler,
      onResetHandler
    }
  }
})
</script>

<style lang="scss" scoped>
.drag-question {
  width: 100%;
  height: 100%;
  &-layer {
    position: absolute;
    z-index: 2;
  }
  .commit-layer {
    z-index: 3;
  }
}
</style>

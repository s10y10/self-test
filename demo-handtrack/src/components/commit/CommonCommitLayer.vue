<template>
  <div class="commit-layer">
    <div class="btn-container">
      <div class="btn reset" :class="{ disabled: !canReset }" @click="$emit('reset')">重置</div>
      <div class="btn commit" :class="{ disabled: !canCommit }" @click="$emit('commit')">提交</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['canCommit', 'canReset']
})
</script>

<style lang="scss" scoped>
.commit-layer {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  .btn-container {
    right: 63px;
    bottom: 41px;
    position: absolute;
    pointer-events: auto;
    .btn {
      margin-top: 30px;
      font-weight: bold;
      text-align: center;
      line-height: 72px;
      font-size: 28px;
      color: #333333;
      width: 188px;
      height: 72px;
      &.commit {
        background: url('../../../public/assets/btn_bg_down.png');
      }
      &.reset {
        background: url('../../../public/assets/btn_bg_normal.png');
      }
      &.disabled {
        color: #999999;
        background: url('../../../public/assets/btn_bg_disable.png');
      }
    }
  }
  &.edit .btn-container {
    pointer-events: none;
  }
}
</style>

<template>
  <div class="star-animation-layer" v-show="showLayer">
    <div class="mask"></div>
    <div class="animation-container">
      <div id="right-animation" v-show="showRight"></div>
      <div id="wrong-animation" v-show="showWrong"></div>
    </div>
    <audio id="right-sound" ref="rightSound" :src="`${publicPath}assets/right.mp3`"></audio>
    <audio id="wrong-sound" ref="wrongSound" :src="`${publicPath}assets/wrong.mp3`"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted, ref } from 'vue'
import store from '../../js/store'
import wrongData from '../../../public/assets/wrong.json'
import rightData from '../../../public/assets/right.json'
import TWEEN from '@tweenjs/tween.js'

import lottie from 'lottie-web'

export default defineComponent({
  setup() {
    const publicPath = ref('./')
    const currentAnswerResult = computed(() => {
      return store.state.currentAnswerResult
    })
    const showLayer = computed(() => {
      return currentAnswerResult.value !== 3
    })

    let wrongAnimation
    let rightAnimation

    let rightSVGDom
    let requestAnimationId = -1

    const rightSound = ref()
    const wrongSound = ref()

    const showRight = ref(false)
    const showWrong = ref(false)

    watch(currentAnswerResult, value => {
      if (value === 1) {
        rightSVGDom.style.left = '0px'
        rightSVGDom.style.top = '0px'
        rightSVGDom.style.transform = `scale(1) translate3d(0px, 0px, 0px)`
        showRight.value = true
        rightAnimation.goToAndPlay(0)
        rightSound.value.play()
      } else if (value === 2) {
        showWrong.value = true
        wrongAnimation.goToAndPlay(0)
        wrongSound.value.play()
      }
    })

    const getShotCut = () => {
      // 获取快照
      const questionLayer = document.querySelector('.question-layer')
      const headLayer = document.querySelector('.head-layer')
      if (!questionLayer || !headLayer) return
      const cloneQuestionNode: any = (questionLayer as HTMLElement).cloneNode(true)
      //删除非当前页节点
      const currentQuestionId = `${store.state.currentQuestionData.id}`
      for (let i = 0; i < cloneQuestionNode.children.length; i++) {
        const child = cloneQuestionNode.children[i]
        if (child.className.includes('question') && child.id !== currentQuestionId) {
          child.remove()
          i--
        }
      }
      const cloneHeadNode: any = (headLayer as HTMLElement).cloneNode(true)
      const node = document.createElement('div')
      node.className = 'carusel__item__wrap'
      node.appendChild(cloneQuestionNode)
      node.appendChild(cloneHeadNode)
      store.state.resScreenShotList.push(node as never)
    }

    const saveResult = () => {
      showRight.value = false
      showWrong.value = false
      const answerResult: any = store.state.answerResult
      answerResult[store.state.currentQuestionIndex] = store.state.currentAnswerResult
      setTimeout(() => {
        getShotCut()
        store.state.currentAnswerResult = 3
        store.toNextQuestion()
      }, 500)
    }

    const wrongComplete = () => {
      saveResult()
    }

    const runAnimate = () => {
      requestAnimationId = requestAnimationFrame(runAnimate)
      TWEEN.update()
    }

    const playFlyAnimate = () => {
      const totalQuestionCount = store.state.activityData.questionList.length
      const flyTargetStarIdx = store.state.currentQuestionIndex
      //中心-starlayer.marginRight-(星星位置 * (星星宽度+star.marginRight)) - offset;
      const targetX = 1920 / 2 - 40 - (totalQuestionCount - flyTargetStarIdx - 1) * (88 + 6) - 50
      const pos0 = { x: 0, y: 0 }
      const pos1 = { x: targetX, y: -496 } //y手量出来的
      const pos2 = { x: pos1.x, y: 0 } //拐点
      const d = { v: 0 }
      new TWEEN.Tween(d)
        .to({ v: 1 }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .onUpdate(({ v }) => {
          rightSVGDom.style.left = `${(1 - v) * (1 - v) * pos0.x + 2 * v * (1 - v) * pos2.x + v * v * pos1.x}px`
          rightSVGDom.style.top = `${(1 - v) * (1 - v) * pos0.y + 2 * v * (1 - v) * pos2.y + v * v * pos1.y}px`
        })
        .onComplete(() => {
          cancelAnimationFrame(requestAnimationId)
          saveResult()
        })
        .start()
    }

    const playScaleAnimate = () => {
      runAnimate()
      let scale = { s: 1 }
      new TWEEN.Tween(scale)
        .to({ s: 0.22 }, 300)
        .onUpdate(obj => {
          rightSVGDom.style.transform = `scale(${obj.s}) translate3d(0px, 0px, 0px)`
        })
        .onComplete(() => {
          playFlyAnimate()
        })
        .start()
    }

    const rightComplete = () => {
      playScaleAnimate()
    }

    onMounted(() => {
      wrongAnimation = lottie.loadAnimation({
        container: document.getElementById('wrong-animation') as any,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: wrongData,
        assetsPath: `${publicPath.value}assets/wrong/`
      })
      rightAnimation = lottie.loadAnimation({
        container: document.getElementById('right-animation') as any,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: rightData,
        assetsPath: `${publicPath.value}assets/right/`
      })

      wrongAnimation.addEventListener('complete', wrongComplete)
      rightAnimation.addEventListener('complete', rightComplete)

      rightSVGDom = document.querySelector('#right-animation svg') as any
    })

    return {
      showLayer,
      rightSound,
      wrongSound,
      showRight,
      showWrong,
      publicPath
    }
  }
})
</script>

<style lang="scss">
.star-animation-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 3;
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: absolute;
  }
  #right-animation,
  #wrong-animation {
    position: absolute;
    left: 0;
    right: 0;
    svg {
      position: relative;
    }
  }

  #right-sound,
  #wrong-sound {
    display: none;
  }
}
</style>

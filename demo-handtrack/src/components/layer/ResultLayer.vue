<template>
  <div class="result-layer" :style="{ visibility: showLayer ? 'visible' : 'hidden' }">
    <div class="result-panel">
      <!-- 标题 -->
      <div class="title">
        <div class="title-contain" v-show="answerResultList.length">
          <img class="bg" src="../../assets/result_title_success.png" v-show="isAllRight" alt="" />
          <img class="bg" v-show="!isAllRight" src="../../assets/result_title_default.png" alt="" />
          <div class="label">{{ isAllRight ? '你真棒' : '挑战结束' }}</div>
        </div>
      </div>
      <!-- 背景图 -->
      <div class="result-buttom-img">
        <img src="../../assets/result_buttom.png" alt="" />
      </div>
      <!-- 面板 -->
      <div class="contain">
        <div class="star-bar">
          <div class="star-item" v-for="(item, idx) in answerResultList" :key="item.id">
            <!-- 五星背景图 -->
            <img class="result-star result-star-bg" src="../../assets/result_star_bg.png" alt="" />
            <img class="result-star  result-star-act" v-if="idx < answerCorrectArr.length" src="../../assets/result_star.png" alt="" />
          </div>
        </div>
        <div class="detail">一共{{ answerResultList.length }}题，答对{{ answerCorrectArr.length }}题</div>
        <div class="show-rt-btn" @click.stop="showResultsFn(true)">查看答题结果</div>
      </div>
    </div>
    <div v-if="showResults" class="result-carousel mask">
      <div class="carousel-contain">
        <!-- 轮播图 -->
        <el-dialog v-model="showResults" destroy-on-close :width="'fit-content'" :top="'10vh'" @close="showResultsFn(false)" custom-class="res-layer-dialog">
          <el-carousel indicator-position="outside" :autoplay="false" arrow="always" height="810px" :pause-on-hover="false">
            <el-carousel-item v-for="(item, idx) in carouselList" :key="idx" v-html="item.outerHTML"> </el-carousel-item>
          </el-carousel>
        </el-dialog>
      </div>
    </div>
    <div id="caidai-animation" v-show="showCaidai"></div>
    <audio id="caidai-sound" ref="caidaiSound" :src="`${publicPath}assets/result.mp3`"></audio>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, watch } from 'vue'
import store from '../../js/store'
import caidaiData from '../../../public/assets/caidai.json'
import lottie from 'lottie-web'

export default defineComponent({
  setup() {
    const publicPath = ref('./')

    const showResults = ref(false)

    const showLayer = computed(() => {
      return store.state.currentStep === 2
    })

    const answerResultList = computed(() => {
      return store.state.answerResult
    })

    const carouselList = computed(() => {
      return store.state.resScreenShotList
    })

    const answerCorrectArr = computed(() => {
      return answerResultList.value.filter(item => item === 1)
    })

    const isAllRight = computed(() => {
      return answerResultList.value.length === answerCorrectArr.value.length
    })

    let caidaiAnimation
    const caidaiSound = ref()
    const showCaidai = ref(false)

    const showResultsFn = flag => {
      showResults.value = flag
    }

    watch(showLayer, val => {
      if (val && isAllRight.value) {
        showCaidai.value = true
        caidaiAnimation.goToAndPlay(0)
        caidaiSound.value.play()
      }
    })

    onMounted(() => {
      caidaiAnimation = lottie.loadAnimation({
        container: document.getElementById('caidai-animation') as any,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: caidaiData
      })
    })

    return {
      showCaidai,
      showLayer,
      caidaiSound,
      answerResultList,
      answerCorrectArr,
      showResultsFn,
      showResults,
      carouselList,
      isAllRight,
      publicPath
    }
  }
})
</script>

<style lang="scss" scoped>
.result-layer {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('../../assets/result_bg.jpg');
  background-size: 100% 100%;
  #caidai-animation {
    position: absolute;
    pointer-events: none;
  }
  #caidai-sound {
    display: none;
  }
  .result-panel {
    position: relative;
    width: 840px;
    height: 579px;
    background: #ffffff;
    box-shadow: 0px 8px 0px 0px rgba(104, 104, 104, 0.5);
    border-radius: 30px;
    padding: 34px 30px 66px;
    .title {
      position: absolute;
      left: 50%;
      top: 0px;
      transform: translate(-50%, -50%);
      .title-contain {
        position: relative;
      }
      .bg {
        height: 120px;
      }
      .label {
        position: absolute;
        left: 50%;
        top: 8px;
        transform: translate(-50%, 0px);
        text-align: center;
        font-size: 40px;
        font-weight: 600;
        color: #ffffff;
        line-height: 56px;
        letter-spacing: 4px;
      }
    }

    .contain {
      display: flex;
      height: 100%;
      flex-direction: column;
      align-items: center;
      background: #fffbea;
      box-shadow: 0px 0px 27px 0px #feebb0;
      border-radius: 20px;
      .star-bar {
        margin-top: 79px;
        min-height: 104px;
        display: flex;
        align-items: center;
        justify-content: center;
        .star-item {
          margin: 0px 7px;
          position: relative;
          .result-star {
            width: 108px;
          }
          .result-star-bg {
          }
          .result-star-act {
            position: absolute;
            left: 0px;
            top: 0px;
          }
        }
      }
      .detail {
        margin-top: 50px;
        font-size: 40px;
        font-weight: normal;
        color: #4f4f4f;
        line-height: 48px;
      }
      .show-rt-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-top: 42px;
        min-width: 303px;
        background: #fde048;
        box-shadow: 0px 5px 0px 0px #feb925;
        border-radius: 43px;
        text-align: center;
        font-size: 30px;
        font-weight: normal;
        color: #895933;
        padding: 22px 62px;
        cursor: pointer;
      }
    }
    .result-buttom-img {
      position: absolute;
      left: 0px;
      bottom: -6px;
      pointer-events: none;
    }
  }
  .result-carousel {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.mask {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
    }
    .carousel-contain {
      position: relative;
      .que-snap-shot {
        width: 100%;
      }
    }
  }
}
</style>
<style lang="scss">
.carousel-contain {
  // 轮播样式重置开始
  .el-overlay {
    overflow: hidden;
  }
  .res-layer-dialog {
    background: none;
    &.el-dialog {
      background: none;
    }
    .el-dialog__header {
      padding-bottom: 30px;
      .el-dialog__headerbtn {
        top: 0px;
        right: 134px;
        .el-dialog__close {
          font-size: 40px;
        }
      }
    }
  }
  .el-carousel--horizontal {
    width: 1680px;
  }
  .el-carousel__container {
    width: 100%;
    height: 100%;
    box-shadow: 0px 0px 24px 0px rgba(107, 133, 158, 0.1);
  }

  .el-carousel__arrow--left,
  .el-carousel__arrow--right {
    width: 80px;
    height: 80px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    i {
      color: #000000;
      font-size: 24px;
      font-weight: bold;
    }
    &:hover {
      background-color: #ffffff;
      i {
        color: #4f4f4f;
      }
    }
  }

  .el-carousel__arrow--left {
    left: 0px;
  }
  .el-carousel__arrow--right {
    right: 0px;
  }

  .el-carousel__button {
    width: 18px;
    height: 18px;
    background: #eaeef6;
    border-radius: 50%;
    opacity: 1;
  }

  .el-carousel__item {
    display: flex;
    justify-content: center;
    align-items: center;
    .carusel__item__wrap {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
    }
    .question-layer,
    .head-layer {
      pointer-events: none;
      width: 1920px;
      height: 1080px;
      left: unset;
      top: unset;
      transform: scale(0.75);
      .btn-container {
        pointer-events: none;
      }
    }
  }

  .el-carousel__indicator--horizontal {
    margin-top: 18px;
    padding: 12px;
  }
  .el-carousel__indicator.is-active button {
    background: #fdea4b;
    opacity: 1;
  }
}
// 轮播样式重置结束
</style>

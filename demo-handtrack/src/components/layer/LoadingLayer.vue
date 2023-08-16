<template>
  <div class="loading-layer">
    <div class="loading-text">{{ loadingText }}</div>
    <div class="loading-block">
      <div class="loading-bar"></div>
      <div class="loading-track">
        <img class="loading-thumb" :style="{ left: thumbLeft }" src="../../assets/loading_bar.png" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import store from '../../js/store'

export default defineComponent({
  setup() {
    const per = computed(() => {
      return store.state.loadingRate
    })
    const loadingText = computed(() => {
      return `资源加载${Math.floor(per.value * 100)}%`
    })
    const BAR_WIDTH = 703

    const thumbLeft = computed(() => {
      return `${BAR_WIDTH * (per.value - 1)}px`
    })

    let totalAssetCount
    let currentLoadedCount = 0

    const finishLoaded = () => {
      setTimeout(() => {
        store.state.currentStep = 2
      }, 150)
    }

    const loadedSinggleAsset = () => {
      currentLoadedCount++
      store.state.loadingRate = currentLoadedCount / totalAssetCount
      if (currentLoadedCount === totalAssetCount) {
        finishLoaded()
      }
    }

    onMounted(() => {
      let URL_REG = /(\.\/images\/.+?(png|jpg|gif|svg|jpeg))/gi
      let assetUrlList = JSON.stringify(store.state.activityData).match(URL_REG)
      if (assetUrlList) {
        assetUrlList = Array.from(new Set(assetUrlList))
      }
      totalAssetCount = assetUrlList?.length
      if (!totalAssetCount) {
        store.state.loadingRate = 1
        finishLoaded()
      } else {
        assetUrlList?.forEach(url => {
          const img = new Image()
          img.onload = loadedSinggleAsset
          img.onerror = loadedSinggleAsset
          img.src = url
        })
      }
    })

    return { loadingText, thumbLeft }
  }
})
</script>

<style lang="scss" scoped>
.loading-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
  background: url('../../assets/loading_bg.jpg');
  .loading-text {
    position: absolute;
    font-size: 40px;
    color: #ffffff;
    top: 425px;
    width: 100%;
    text-align: center;
  }
  .loading-block {
    position: absolute;
    top: 525px;
    left: 50%;
    width: 718px;
    transform: translate(-50%);
    .loading-bar {
      position: absolute;
      width: 718px;
      height: 68px;
      background: url('../../assets/loading_track.png');
    }
    .loading-track {
      position: absolute;
      width: 703px;
      height: 48px;
      left: 7px;
      top: 8px;
      mask-image: url('../../assets/loading_bar.png');
      .loading-thumb {
        position: absolute;
        left: -703px;
        top: 0;
      }
    }
  }
}
</style>

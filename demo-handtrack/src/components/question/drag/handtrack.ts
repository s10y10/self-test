import * as handTrack from 'handtrackjs'
import store from '../../../js/store'

const defaultParams = {
  flipHorizontal: true,
  outputStride: 16,
  imageScaleFactor: 0.5,
  maxNumBoxes: 10,
  iouThreshold: 0.5,
  scoreThreshold: 0.79,
  modelType: 'ssd320fpnlite',
  modelSize: 'small',
  bboxLineWidth: '2',
  fontSize: 17
}

let stageElScale, originEl, copyEl, targetPlaceEl, placeElRectList, view

let handPointEl
let video
let canvas
let ctx
let model
let rootEl

const rateX = 1920 / 640
const rateY = 1080 / 480

const STATE = {
  IDLE: 1,
  MOVE: 2
}
let state = STATE.IDLE

class HandTrackController {
  checkPoint(point) {
    if (!point) return
    const x = point.bbox[0] * rateX
    const y = point.bbox[1] * rateY

    point.x = x
    point.y = y

    stageElScale = store.state.stageScale

    handPointEl.style.left = x + 'px'
    handPointEl.style.top = y + 'px'

    const tempEl: any = document.elementFromPoint(x, y)
    if (!originEl) {
      if (tempEl && tempEl.classList.contains('drag-option') && point.label === 'open') {
        originEl = tempEl
        originEl.bindItem.opClass = 'hover'
      }
    } else {
      if (tempEl && tempEl.classList.contains('drag-option') && point.label === 'open') {
        if (originEl !== tempEl) {
          originEl.bindItem.opClass = ''
          originEl = tempEl
          originEl.bindItem.opClass = 'hover'
        }
      }
    }

    if (originEl) {
      if (point.label === 'closed') {
        if (state === STATE.IDLE) {
          this.onDownOptionEvent(point)
        } else {
          this.onMoveEvent(point)
        }
      } else if (point.label === 'open') {
        if (state === STATE.MOVE) {
          this.onUpPlaceEvent()
          copyEl.remove()
          copyEl = null
          originEl.bindItem.opClass = ''
          originEl = null
          targetPlaceEl = null
          state = STATE.IDLE
        }
      }
    }
  }

  onUpPlaceEvent() {
    if (!targetPlaceEl) return
    const placeItem = targetPlaceEl.bindItem
    if (copyEl && !placeItem.hasAnswer) {
      const optionItem = originEl.bindItem
      placeItem.opClass = 'complete'
      placeItem.content = optionItem.content
      const optionItemStyle = Object.assign({}, optionItem.style)
      const needDelKeys = ['left', 'top', 'width', 'height', 'z-index']
      needDelKeys.forEach(key => {
        delete optionItemStyle[key]
      })
      Object.assign(placeItem.style, optionItemStyle)
      placeItem.hasAnswer = true
      this.checkCommitBtnState()
    }
  }

  checkCommitBtnState() {
    const currentQuestionData: any = store.state.currentQuestionData
    const placeItemArr = Array.from(document.querySelectorAll(`#${currentQuestionData.id} .drag-place`)).map(el => {
      return (el as any).bindItem
    })
    view.canCommit = placeItemArr.every(item => {
      return item.hasAnswer
    })
    view.canReset = placeItemArr.some(item => {
      return item.hasAnswer
    })
  }

  checkTargetPlace({ x, y }) {
    let tempEl = null
    for (let i = 0; i < placeElRectList.length; i++) {
      const rect = placeElRectList[i]
      if (!rect.el.bindItem.hasAnswer && rect.x1 <= x && rect.x2 >= x && rect.y1 <= y && rect.y2 >= y) {
        tempEl = rect.el
        break
      }
    }
    if (!tempEl) {
      this.onOutPlaceEvent()
    } else if (tempEl !== targetPlaceEl) {
      this.onOutPlaceEvent()
      targetPlaceEl = tempEl
      this.onOverPlaceEvent()
    }
  }

  setElPos(el, point) {
    let { x, y } = point
    const rootX = rootEl.getBoundingClientRect().x
    x = (x - rootX) / stageElScale
    y = y / stageElScale
    el.style.left = `${x}px`
    el.style.top = `${y}px`
  }

  onMoveEvent(point) {
    if (!copyEl) return
    this.setElPos(copyEl, point)
    this.checkTargetPlace(point)
  }

  onDownOptionEvent(point) {
    state = STATE.MOVE

    if (copyEl) {
      copyEl.remove()
    }

    copyEl = originEl.cloneNode(true)
    originEl.parentNode.appendChild(copyEl)

    originEl.bindItem.opClass = 'dragging'

    this.setElPos(copyEl, point)
    copyEl.style.pointerEvents = 'none'
    copyEl.style.zIndex = 999999

    placeElRectList = this.getPlaceElRectList()
  }

  onOverPlaceEvent() {
    if (!targetPlaceEl) return
    const placeItem = targetPlaceEl.bindItem
    if (copyEl && !placeItem.hasAnswer) {
      placeItem.opClass = 'dragging'
    }
  }

  onOutPlaceEvent() {
    if (!targetPlaceEl) return
    const placeItem = targetPlaceEl.bindItem
    if (!placeItem.hasAnswer) {
      placeItem.opClass = ''
    }
    targetPlaceEl = null
  }

  getPlaceElRectList() {
    const currentQuestionData: any = store.state.currentQuestionData
    const placeElList = Array.from(document.querySelectorAll(`#${currentQuestionData.id} .drag-place`))
    return placeElList
      .sort((placeA: any, placeB: any) => {
        return +placeB.style['z-index'] - placeA.style['z-index']
      })
      .map(el => {
        const rect = el.getBoundingClientRect()
        return {
          el,
          x1: rect.left,
          x2: rect.left + rect.width,
          y1: rect.top,
          y2: rect.top + rect.height
        }
      })
  }

  render() {
    model.detect(video).then(predictions => {
      const filterList = predictions.filter(p => {
        return p.label === 'point' || p.label === 'open' || p.label === 'closed'
      })
      const point = filterList[0]
      this.checkPoint(point)
      model.renderPredictions(filterList, canvas, ctx, video)
    })
    requestAnimationFrame(this.render.bind(this))
  }

  async startHandTrack(_view) {
    view = _view
    rootEl = document.querySelector('.root')
    handPointEl = document.getElementById('handPoint')
    video = document.getElementById('videoid')
    canvas = document.getElementById('canvasid')
    ctx = canvas.getContext('2d')
    model = await handTrack.load(defaultParams)
    await handTrack.startVideo(video)
    this.render()
  }
}

export default new HandTrackController()

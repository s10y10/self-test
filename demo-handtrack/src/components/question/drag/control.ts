import { ITEM_TYPE } from '@/const/item-type'
import { EventType, addListener, removeListener, getGesturePointFromEvent } from '../../../js/const/event'
import store from '../../../js/store'
import HandTrackController from './handtrack'

let difX, difY, preClientX, preClientY, stageElScale, originEl, copyEl, targetPlaceEl, placeElRectList

class DragQuestionControl {
  private _view: any
  constructor() {
    this.onMoveEvent = this.onMoveEvent.bind(this)
    this.onMoveEndEvent = this.onMoveEndEvent.bind(this)
    this.onDownOptionEvent = this.onDownOptionEvent.bind(this)
  }

  install(questionData, view) {
    this._view = view
    const items = questionData.displayContent.items
    items.forEach(item => {
      if (item.type === ITEM_TYPE.DRAG_OPTION) {
        this.addOptionEvent(item, questionData)
      } else if (item.type === ITEM_TYPE.DRAG_PLACE) {
        this.addPlaceEvent(item, questionData)
      }
    })
    HandTrackController.startHandTrack(this._view)
  }

  addOptionEvent(item, questionData) {
    const el = document.querySelector(`#${questionData.id} #${item.id}`) as any
    el.bindItem = item //记录一下绑定的item,好取
    addListener(el, EventType.down, this.onDownOptionEvent)
  }

  addPlaceEvent(item, questionData) {
    const el = document.querySelector(`#${questionData.id} #${item.id}`) as any
    el.bindItem = item
  }

  onDownOptionEvent(e) {
    const point = getGesturePointFromEvent(e)

    originEl = e.currentTarget

    if (copyEl) {
      copyEl.remove()
    }

    copyEl = originEl.cloneNode(true)
    originEl.parentNode.appendChild(copyEl)

    originEl.bindItem.opClass = 'dragging'

    copyEl.posX = parseInt(originEl.style.left)
    copyEl.posY = parseInt(originEl.style.top)
    copyEl.style.pointerEvents = 'none'
    copyEl.style.zIndex = 999999

    preClientX = point.x
    preClientY = point.y
    stageElScale = store.state.stageScale

    placeElRectList = this.getPlaceElRectList()

    addListener(window, EventType.move, this.onMoveEvent)
    addListener(window, EventType.up, this.onMoveEndEvent)
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

  onMoveEvent(e) {
    e.preventDefault()
    const point = getGesturePointFromEvent(e)
    difX = point.x - preClientX
    difY = point.y - preClientY
    difX /= stageElScale
    difY /= stageElScale
    copyEl.style.left = `${copyEl.posX + difX}px`
    copyEl.style.top = `${copyEl.posY + difY}px`
    this.checkTargetPlace(point)
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

  onMoveEndEvent(e) {
    this.onUpPlaceEvent()
    copyEl.remove()
    copyEl = null
    originEl.bindItem.opClass = ''
    originEl = null
    targetPlaceEl = null
    removeListener(window, EventType.move, this.onMoveEvent)
    removeListener(window, EventType.up, this.onMoveEndEvent)
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

  resetQuestionData(questionData) {
    const items = questionData.displayContent.items
    items.forEach(item => {
      if (item.type === ITEM_TYPE.DRAG_OPTION) {
        item.opClass = ''
      } else if (item.type === ITEM_TYPE.DRAG_PLACE) {
        item.opClass = ''
        item.hasAnswer = false
        item.content = ''
      }
    })
  }

  commitAnswer(questionData) {
    const answerArr = questionData.answerContent.items
    const placeArr = questionData.positionContent.items
    const items = questionData.displayContent.items
    const placeItemArr = placeArr.map(place => {
      return items.find(item => item.id === place.bindId)
    })
    let answerResult = false
    for (let i = 0; i < answerArr.length; i++) {
      let answerGroup = answerArr[i]
      answerResult = !answerGroup.some((answer, idx) => {
        return answer !== placeItemArr[idx].content
      })
      if (answerResult) {
        break
      }
    }
    //触发判定动画
    store.state.currentAnswerResult = answerResult ? 1 : 2
  }

  checkCommitBtnState() {
    const currentQuestionData: any = store.state.currentQuestionData
    const placeItemArr = Array.from(document.querySelectorAll(`#${currentQuestionData.id} .drag-place`)).map(el => {
      return (el as any).bindItem
    })
    this._view.canCommit = placeItemArr.every(item => {
      return item.hasAnswer
    })
    this._view.canReset = placeItemArr.some(item => {
      return item.hasAnswer
    })
  }
}

export default DragQuestionControl

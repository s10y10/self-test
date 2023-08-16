const POINTER_EVENTS = {
  down: 'pointerdown',
  up: 'pointerup',
  move: 'pointermove'
}

const MOUSE_EVENTS = {
  down: 'mousedown',
  up: 'mouseup',
  move: 'mousemove'
}

const TOUCH_EVENTS = {
  down: 'touchstart',
  up: 'touchend',
  move: 'touchmove'
}

const getEvents = () => {
  const events: any = {
    down: undefined,
    up: undefined,
    move: undefined
  }
  events.down = [MOUSE_EVENTS.down, TOUCH_EVENTS.down]
  events.up = [MOUSE_EVENTS.up, TOUCH_EVENTS.up]
  events.move = [MOUSE_EVENTS.move, TOUCH_EVENTS.move]
  return events
}

const addListener = (target, type, handler) => {
  if (Array.isArray(type)) {
    type.forEach(t => {
      target.addEventListener(t, handler, { passive: false })
    })
  } else {
    target.addEventListener(type, handler, { passive: false })
  }
}

const removeListener = (target, type, handler) => {
  if (Array.isArray(type)) {
    type.forEach(t => {
      target.removeEventListener(t, handler)
    })
  } else {
    target.removeEventListener(type, handler)
  }
}

const getGesturePointFromEvent = evt => {
  const point = { x: 0, y: 0 }
  if (evt.targetTouches) {
    point.x = evt.targetTouches[0].clientX
    point.y = evt.targetTouches[0].clientY
  } else {
    point.x = evt.clientX
    point.y = evt.clientY
  }
  return point
}

const EventType = getEvents()
export { EventType, addListener, removeListener, getGesturePointFromEvent }

import {
  Style as OlStyleStyle,
  Fill as OlStyleFill,
  Icon as OlStyleIcon,
  Text as OlStyleText
} from 'ol/style'
import { Pointer as PointerInteraction } from 'ol/interaction'
export function getStyle(feature, lv) {
  let style = []
  let isScale = [0.5, 1.0, 2.0]
  for (var img of feature.get('features')[0].get('image')) {
    // 이미지 default 값 지정
    let posx = 0.5
    let posy = 0.5

    // 이미지 x,y 설정
    if (
      typeof img['x'] !== 'undefined' &&
      img['x'] !== null &&
      img['x'] !== ''
    ) {
      if (img['x'] !== '') {
        posx = img['x']
      }
    }
    if (
      typeof img['y'] !== 'undefined' &&
      img['y'] !== null &&
      img['y'] !== ''
    ) {
      posy = img['y']
    }

    // 이미지 정렬 기능
    let imgAlign = img['align']
    if (imgAlign === 'left' && posx > 0) {
      posx = posx * -1
    }
    if (imgAlign === 'right' && posx < 0) {
      posx = posx * -1
    }
    // x값이 양수일 때 음수로 변경해줘야 반대로 간다.
    if (imgAlign === 'left' || imgAlign === 'right') {
      if (Number(posx) !== 0 && posx !== 0.5) {
        posx = posx * -1
      }
    } else if (imgAlign === 'center') {
      posx = 0.5 // center로 지정할 경우 축 중간으로 이동하도록 한다. y축은 유지
    } else if (imgAlign === null && posx !== 0.5 && Number(posx) !== 0) {
      // align 선택을 하지 않았을 경우 기존의 posx를 유지하도록 한다.
      posx = posx * -1
    }
    style.push(
      new OlStyleStyle({
        image: new OlStyleIcon({
          src: img['url'],
          anchor: [posx, posy], // 위치가 지정되있을때는 드레그 선택폭이 좁아짐.
          scale: isScale[lv] // 확대/축소에 따른 이미지 크기 바뀜.
        })
      })
    )
  }
  for (var txt of feature.get('features')[0].get('text')) {
    let posx = 0
    let posy = 0
    let txtSize = 10
    let txtColor = '#000000'
    let textAlign = 'center'
    if (typeof txt['x'] !== 'undefined') {
      posx = txt['x']
    }
    if (typeof txt['y'] !== 'undefined') {
      posy = txt['y']
    }
    if (typeof txt['size'] !== 'undefined') {
      txtSize = txt['size']
    }
    if (typeof txt['color'] !== 'undefined') {
      txtColor = txt['color']
    }
    if (typeof txt['align'] !== 'undefined') {
      textAlign = txt['align']
    }
    style.push(
      new OlStyleStyle({
        text: new OlStyleText({
          text: txt['value'],
          fill: new OlStyleFill({ color: txtColor }),
          textAlign: textAlign,
          offsetX: posx * isScale[lv],
          offsetY: posy * isScale[lv],
          font: ' ' + txtSize * isScale[lv] + 'px Malgun Gothic'
        })
      })
    )
  }
  return style
}

export class Drag extends PointerInteraction {
  constructor() {
    super({
      handleDownEvent: handleDownEvent,
      handleDragEvent: handleDragEvent,
      handleMoveEvent: handleMoveEvent,
      handleUpEvent: handleUpEvent
    })
    this.coordinate_ = null
    this.cursor_ = 'pointer'
    this.feature_ = null
    this.previousCursor_ = undefined
    this.handleUpCallback = null
  }

  setHandleUpCallback(callback) {
    this.handleUpCallback = callback
  }
}

function handleDownEvent(evt) {
  const map = evt.map

  const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    return feature
  })

  if (feature) {
    this.coordinate_ = evt.coordinate
    this.feature_ = feature
  }

  return !!feature
}

function handleDragEvent(evt) {
  const deltaX = evt.coordinate[0] - this.coordinate_[0]
  const deltaY = evt.coordinate[1] - this.coordinate_[1]

  const geometry = this.feature_.getGeometry()
  geometry.translate(deltaX, deltaY)

  this.coordinate_[0] = evt.coordinate[0]
  this.coordinate_[1] = evt.coordinate[1]
}

function handleMoveEvent(evt) {
  if (this.cursor_) {
    const map = evt.map
    const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
      return feature
    })
    const element = evt.map.getTargetElement()
    if (feature) {
      if (element.style.cursor !== this.cursor_) {
        this.previousCursor_ = element.style.cursor
        element.style.cursor = this.cursor_
      }
    } else if (this.previousCursor_ !== undefined) {
      element.style.cursor = this.previousCursor_
      this.previousCursor_ = undefined
    }
  }
}

function handleUpEvent(evt) {
  const map = evt.map
  const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    return feature
  })
  if (feature) {
    if (this.handleUpCallback) {
      this.handleUpCallback({
        feature,
        feature_: this.feature_
      })
    }
  }
  this.coordinate_ = null
  this.feature_ = null
  return false
}

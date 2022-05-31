const IMAGE_ITEM_NM_CD = ['GN00000346', 'GN00000347'] // GN00000346: ICON, GN00000347: BACKGROUND
const ALIGN_CD = {
  GN00000359: 'left',
  GN00000360: 'center',
  GN00000361: 'right'
}

/**
 * 데이터에 맞는 심볼 템플릿 속성 조회
 * @param {*} tmplAttbList 심볼 템플릿 속성 목록
 * @param {*} data 데이터
 */
export function getFeature(
  tmplAttbList,
  data = {},
  coordinates = [0, 0],
  info = {}
) {
  let attbList = getMatchedAttbList(tmplAttbList, data)
  let images = []
  let texts = []
  attbList.forEach(attb => {
    if (IMAGE_ITEM_NM_CD.includes(attb.itemNmCd)) {
      images.push({
        url: attb.itemVal,
        w: attb.imgWidth,
        h: attb.imgHeight,
        x: attb.posX,
        y: attb.posY,
        align: ALIGN_CD[attb.alignCd]
      })
    } else {
      texts.push({
        value: replaceData(attb.itemVal, data),
        x: attb.posX,
        y: attb.posY,
        align: ALIGN_CD[attb.alignCd],
        color: attb.fontColor,
        size: attb.fontSize
      })
    }
  })
  return {
    coordinates: coordinates,
    images: images,
    texts: texts,
    info: info
  }
}

/**
 * 데이터 replace
 * @param {*} value
 * @param {*} data
 */
export function replaceData(value, data) {
  let keys = value.match(/#{.*?}/g)
  if (!keys) {
    return value
  }
  keys.forEach(key => {
    key = key
      .split('#{')
      .join('')
      .split('}')
      .join('')
    if (data[key]) {
      value = value.replaceAll('#{' + key + '}', data[key])
    }
  })
  return value
}

/**
 * 데이터에 맞는 템플릿 속성 목록 조회
 * @param {*} tmplAttbList 템플릿 속성 목록
 * @param {*} data 데이터
 */ export function getMatchedAttbList(tmplAttbList, data) {
  const attbList = []
  let uniqAttbs = tmplAttbList.filter(
    (attb, index, self) =>
      index === self.findIndex(a => a.itemNmCd === attb.itemNmCd)
  )
  uniqAttbs.forEach(uniqAttb => {
    let finalAttb = null
    let attbs = tmplAttbList.filter(attb => attb.itemNmCd === uniqAttb.itemNmCd)
    attbs.forEach(attb => {
      if (attb.itemWhere.length === 0 || checkAttbWithData(attb, data)) {
        finalAttb = attb
      }
    })
    if (finalAttb) {
      attbList.push(finalAttb)
    }
  })
  return attbList
}

/**
 * 데이터가 해당 속성에 맞는지 확인
 * @param {*} attb 심볼 템플릿 속성
 * @param {*} data 데이터
 */
export function checkAttbWithData(attb, data) {
  if (!data || Object.keys(data).length === 0) {
    return false
  }
  let where = attb.itemWhere
  let variables = where
    .split(' ')
    .filter(v => v.startsWith('#{') && v.endsWith('}'))

  variables.forEach(v => {
    v = v
      .split('#{')
      .join('')
      .split('}')
      .join('')
    let value = data[v.toUpperCase()] || data[v.toLowerCase()]
    if (!value || value !== '') {
      where = where.replaceAll('#{' + v + '}', value)
    }
  })

  if (where.indexOf('attb_') > -1) {
    return false
  }

  // eslint-disable-next-line no-eval
  let checkWhere = eval(where)
  return checkWhere
}

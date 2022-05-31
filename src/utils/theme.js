import localStore from '@/utils/localStore'

/**
 * 사용자의 저장된 테마를 불러온다.
 * @param custId 고객사 ID
 * @param usrId 사용자 ID
 * @returns {string | null}
 */
export function getTheme (custId, usrId) {
  return localStore.get(JSON.stringify({
    custId: custId,
    usrId: usrId
  }))
}

/**
 * 사용자의 테마를 저장한다.
 * @param custId 고객사 ID
 * @param usrId 사용자 ID
 * @param theme
 */
export function setTheme (custId, usrId, theme) {
  localStore.set(
    JSON.stringify({
      custId: custId,
      usrId: usrId
    }),
    theme || ''
  )
}

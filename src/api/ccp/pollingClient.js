import { excuteApi, executeQuery, executePolling } from '@/api/common/api'
const INTERVAL_MAP = {}

class PollingClient {
  addPolling(key, type, params, tickHandler, useRefresh, delayTime) {
    if (INTERVAL_MAP[key]) {
      this.deletePolling(key)
    }

    let func = null
    switch (type) {
      case 'A':
        func = this.executeApi
        break
      case 'T':
        func = this.executePolling
        break
      case 'Q':
        func = this.executeQuery
        break
    }

    func(params, tickHandler)

    if (useRefresh) {
      let interval = setInterval(() => {
        func(params, tickHandler)
      }, delayTime)
      INTERVAL_MAP[key] = interval
    }
  }

  deletePolling(key) {
    this.clearInterval(key)
  }

  executeApi(params, tickHandler) {
    excuteApi(params).then(res => {
      tickHandler(res)
    })
  }

  executePolling(params, tickHandler) {
    executePolling(params).then(res => {
      tickHandler(res)
    })
  }

  executeQuery(params, tickHandler) {
    executeQuery(params).then(res => {
      tickHandler(res)
    })
  }

  clearInterval(key) {
    clearInterval(INTERVAL_MAP[key])
    delete INTERVAL_MAP[key]
  }

  clearAllInterval() {
    Object.keys(INTERVAL_MAP).forEach(key => {
      clearInterval(INTERVAL_MAP[key])
      delete INTERVAL_MAP[key]
    })
  }
}

export default PollingClient

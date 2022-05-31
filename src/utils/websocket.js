import Stomp from 'stompjs'

const ws = () => {
  let client = null
  let options = {
    url: undefined,
    events: {}
  }
  let subscribes = []

  const connect = (url, events = {}) => {
    if (!url || url.length === 0) {
      console.error('required url')
      return false
    }
    let headers = {}
    client = Stomp.client(url)
    client.connect(headers, onConnect)

    options.events = events
  }

  const disconnect = () => {
    client.disconnect()
    onDisconnect()
  }

  const onConnect = data => {
    if (options.events.onconnect) {
      options.events.onconnect(data)
    }
  }

  const onDisconnect = data => {
    if (options.events.ondisconnect) {
      options.events.ondisconnect(data)
    }
  }

  const send = (key, data) => {
    client.send(key, { 'content-type': 'text/plain' }, data)
  }

  const subscribe = key => {
    const subscribe = client.subscribe(key, function(data) {
      if (options.events.onmessage) {
        options.events.onmessage(data)
      }
    })

    subscribes.push({
      key: key,
      instance: subscribe
    })
  }

  const unsubscribe = key => {
    const subscribe = subscribes.find(subs => subs.key === key)
    if (subscribe) {
      subscribe.instance.unsubscribe()
    }
  }

  return {
    connect,
    disconnect,
    send,
    subscribe,
    unsubscribe
  }
}

export default ws

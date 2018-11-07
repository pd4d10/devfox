const params = new URLSearchParams(location.search)
const tabId = parseInt(params.get('id'), 10)

chrome.debugger.sendCommand({ tabId }, 'Network.enable')

chrome.debugger.onEvent.addListener((source, method, params) => {
  if (tabId != source.tabId) return

  console.log(source, method, params)

  switch (method) {
    case 'Network.requestWillBeSent': {
    }
    case 'Network.responseReceived': {
    }
  }
})

window.addEventListener('unload', () => {
  chrome.debugger.detach({ tabId })
})

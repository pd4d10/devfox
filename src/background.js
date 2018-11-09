const PROTOCOL_VERSION = '1.3'

chrome.browserAction.onClicked.addListener(tab => {
  console.log(tab)

  chrome.debugger.attach({ tabId: tab.id }, PROTOCOL_VERSION, () => {
    chrome.windows.create({
      url: 'dist/devtools.html?id=' + tab.id,
      type: 'popup',
      width: 800,
      height: 600,
    })
  })
})

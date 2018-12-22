import {
  DebuggerClient,
  TargetFactory,
} from '../debugger.html/node_modules/devtools-connection'
import DevfoxTransport from './transport'

// Implement debugger client
// devtools-connection/src/debugger/client.js
let debuggerClient = null

function createTabs(tabs) {
  return tabs.map(tab => {
    return {
      title: tab.title,
      url: tab.url,
      id: tab.actor,
      tab,
      clientType: 'firefox',
    }
  })
}

// async function getTabs() {
//   if (!debuggerClient || !debuggerClient.mainRoot) {
//     return undefined
//   }

//   const response = await debuggerClient.listTabs()
//   return createTabs(response.tabs)
// }

export async function connectClient() {
  const transport = new DevfoxTransport()
  debuggerClient = new DebuggerClient(transport)
  // if (!debuggerClient) {
  //   return []
  // }
  ;(async () => {
    try {
      await debuggerClient.connect()
      // return await getTabs()
      return []
    } catch (err) {
      console.log(err)
      return []
    }
  })()

  debuggerClient.emit('packet', {})
  return []
}

export async function connectTab(tab) {
  window.addEventListener('beforeunload', () => {
    if (tabTarget !== null) {
      tabTarget.destroy()
    }
  })

  const tabTarget = await TargetFactory.forRemoteTab({
    client: debuggerClient,
    form: tab,
    chrome: false,
  })

  const [, threadClient] = await tabTarget.activeTab.attachThread({
    ignoreFrameEnvironment: true,
  })

  threadClient.resume()
  return { debuggerClient, threadClient, tabTarget }
}

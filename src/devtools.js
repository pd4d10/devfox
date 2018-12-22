import React from '../debugger.html/node_modules/react'
import ReactDOM from '../debugger.html/node_modules/react-dom'
import { Provider } from '../debugger.html/node_modules/react-redux'
import App from '../debugger.html/src/components/App'
import * as firefox from '../debugger.html/src/client/firefox'
import { prefs, asyncStore } from '../debugger.html/src/utils/prefs'
import L10N from '../debugger.html/node_modules/devtools-launchpad/src/utils/L10N'
import sourceMaps from '../debugger.html/node_modules/devtools-source-map'
import * as search from '../debugger.html/src/workers/search'
import * as prettyPrint from '../debugger.html/src/workers/pretty-print'
import * as parser from '../debugger.html/src/workers/parser'
import { setupHelper } from '../debugger.html/src/utils/dbg'
import { bootstrapStore } from '../debugger.html/src/utils/bootstrap'
import { initialBreakpointsState } from '../debugger.html/src/reducers/breakpoints'
import * as client from './client'

import '../debugger.html/node_modules/devtools-mc-assets/assets/devtools/client/themes/light-theme.css'
import '../debugger.html/node_modules/devtools-mc-assets/assets/devtools/client/themes/dark-theme.css'

document.documentElement.classList.add('theme-light')

window.L10N = L10N
window.L10N.setBundle(
  require('../debugger.html/assets/panel/debugger.properties'),
)

function loadFromPrefs(actions) {
  const { pauseOnExceptions, pauseOnCaughtExceptions } = prefs
  if (pauseOnExceptions || pauseOnCaughtExceptions) {
    return actions.pauseOnExceptions(pauseOnExceptions, pauseOnCaughtExceptions)
  }
}

function syncXHRBreakpoints() {
  asyncStore.xhrBreakpoints.then(bps => {
    bps.forEach(({ path, method, disabled }) => {
      if (!disabled) {
        firefox.clientCommands.setXHRBreakpoint(path, method)
      }
    })
  })
}

async function loadInitialState() {
  const pendingBreakpoints = await asyncStore.pendingBreakpoints
  const tabs = await asyncStore.tabs
  const xhrBreakpoints = await asyncStore.xhrBreakpoints

  const breakpoints = initialBreakpointsState(xhrBreakpoints)

  return { pendingBreakpoints, tabs, breakpoints }
}

async function main() {
  const initialState = await loadInitialState()
  const { store, actions, selectors } = bootstrapStore(
    firefox.clientCommands,
    {
      services: { sourceMaps },
      toolboxActions: {},
    },
    initialState,
  )

  // workers
  sourceMaps.startSourceMapWorker(
    '/dist/source-map-worker.js',
    './source-map-worker-assets/',
  )
  prettyPrint.start('/dist/pretty-print-worker.js')
  parser.start('/dist/parser-worker.js')
  search.start('/dist/search-worker.js')

  // TODO:
  const tabs = await client.connectClient()
  // if (!tabs) return undefined

  const tab = tabs.find(t => t.id.indexOf(connTarget.param) !== -1)
  // if (!tab) return undefined

  const tabConnection = await client.connectTab({
    title: 'title',
    url: 'url',
    id: 'id',
    // FIXME: would be good to fill this out better
    tab: '',
    clientType: 'chrome',
  })
  const connection = { tabConnection }

  await firefox.onConnect(connection, actions)
  await loadFromPrefs(actions)
  syncXHRBreakpoints()
  setupHelper({
    store,
    actions,
    selectors,
    workers: { prettyPrint, parser, search, sourceMaps },
    connection,
    client: firefox.clientCommands,
  })

  const root = document.createElement('div')
  document.body.appendChild(root)
  ReactDOM.render(
    React.createElement(Provider, { store }, React.createElement(App)),
    root,
  )
}

main()

// const params = new URLSearchParams(location.search)
// const tabId = parseInt(params.get('id'), 10)

// chrome.debugger.sendCommand({ tabId }, 'Debugger.enable')

// chrome.debugger.onEvent.addListener((source, method, params) => {
//   if (tabId != source.tabId) return

//   console.log(method, params)

//   switch (method) {
//     case 'Network.requestWillBeSent': {
//     }
//     case 'Network.responseReceived': {
//     }
//   }
// })

// window.addEventListener('unload', () => {
//   chrome.debugger.detach({ tabId })
// })

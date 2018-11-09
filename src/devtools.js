import React from '../debugger.html/node_modules/react'
import ReactDOM from '../debugger.html/node_modules/react-dom'
import { Provider } from '../debugger.html/node_modules/react-redux'
import App from '../debugger.html/src/components/App'
import * as firefox from '../debugger.html/src/client/firefox'

import { asyncStore } from '../debugger.html/src/utils/prefs'
import { L10N } from '../debugger.html/node_modules/devtools-launchpad'

import { bootstrapStore } from '../debugger.html/src/utils/bootstrap'
import { initialBreakpointsState } from '../debugger.html/src/reducers/breakpoints'

document.documentElement.classList.add('theme-light')

window.L10N = L10N
window.L10N.setBundle(
  require('../debugger.html/assets/panel/debugger.properties'),
)

async function loadInitialState() {
  const pendingBreakpoints = await asyncStore.pendingBreakpoints
  const tabs = await asyncStore.tabs
  const xhrBreakpoints = await asyncStore.xhrBreakpoints

  const breakpoints = initialBreakpointsState(xhrBreakpoints)

  return { pendingBreakpoints, tabs, breakpoints }
}

const services = {
  sourceMaps: require('../debugger.html/node_modules/devtools-source-map'),
}

export async function main() {
  const commands = firefox.clientCommands
  const initialState = await loadInitialState()
  const { store } = bootstrapStore(
    commands,
    {
      services,
      toolboxActions: {},
    },
    initialState,
  )

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

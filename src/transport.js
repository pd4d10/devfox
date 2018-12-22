import EventEmitter from '../debugger.html/node_modules/devtools-connection/src/utils/event-emitter'

// Implement transport
// devtools-connection/src/transport
export default class DevfoxTransport extends EventEmitter {
  constructor(...args) {
    super(...args)
  }

  ready() {
    console.log('ready', arguments)
  }

  send() {
    console.log('send', arguments)
  }

  startBulkSend() {
    console.log('startBulkSend', arguments)
  }

  close() {
    console.log('close', arguments)
  }

  handleEvent(event) {
    console.log('handleEvent', arguments)
  }

  onMessage({ data }) {
    console.log('onMessage', arguments)
  }
}

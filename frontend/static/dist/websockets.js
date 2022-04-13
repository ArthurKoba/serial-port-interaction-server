class WS {
  url = 'ws://localhost/'

  constructor (url, debug = false) {
    if (url) this.url = url
    this.debug = false;
    this._waitConnection()
  }

  _waitConnection() {
    this._ws = new WebSocket(this.url)
    this._ws.ws = this
    this._initWsHandlers()
  }

  _initWsHandlers () {
    this._ws.onopen = this._connectHandler.bind(this)
    this._ws.onclose = this._closeHandler.bind(this)
    this._ws.onmessage = this._messageHandler.bind(this)
    this._ws.onerror = this._errorHandler.bind(this)
  }

  _sendMessage(message) {
    if (this._ws.readyState === 1) { this._ws.send(message) }
  }

  async _connectHandler(event) { }

  async _closeHandler(event) {
    // await new Promise(r => setTimeout(r, 5000));
    // event.target.ws._waitConnection()
  }

  async _messageHandler(event) { await event.data.text() }

  async _errorHandler(event) { console.log('error', event) }

  disconnect() { this._ws.close() }
}

export class SerialWebSocket extends WS {
  // debug = true
  _handlers = {}

  getHandlersForDataType (dataType) {
    for (let targetDataType of Object.keys(this._handlers)) {
      if (targetDataType !== dataType) continue
      return this._handlers[targetDataType]
    }
  }

  async _messageHandler(event) {
    let data = await event.data.text()
    try {
      data = JSON.parse(data)
      let handlers = this.getHandlersForDataType(data.dataType)
      if (handlers) { for (let handler of handlers) { handler(data.data) }
      } else if (this.debug) {
        console.warn(`Handler for "${data.dataType}" - not registered. Data:`, data.data)
      }
    } catch (e) { if (e.name == 'SyntaxError') {
        this.unknownHandler(data)
      } else { throw e }
    }
  }

  registerHandlerObject(dataType, object) {
    if (!this._handlers[dataType]) this._handlers[dataType] = [object.dataHandler.bind(object)]
    else this._handlers[dataType].push(object.dataHandler.bind(object))
    console.warn(`Handler for "${dataType}" - success registered!`);
  }

  unknownHandler(object) {
    console.log(object);
  }
  async _connectHandler(event) {
    this.connected = true;
  }

}

export class ReloadWebsocket extends WS {

  async _connectHandler(event) {
    console.log("Reloader connected!")
    this.connected = true;
  }

  async _closeHandler(event) {
    if (!this.connected) return
    console.warn("Connection closed. Wait restarting server...")
    while (true) {
        await (new Promise(res => setTimeout(res, 100)))
        try {
          if ((await fetch('/ping')).status === 200) {
            console.log("Сonnection restored. Reload page...")
            location.reload()
          }
        } catch (e) {
          continue
        }
    }
  }
}

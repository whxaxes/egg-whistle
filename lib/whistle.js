const { EventEmitter } = require('events');
const PROXY_WHISTLE_URI = Symbol('whistle#proxyUri');
const PROXY_WHISTLE_AGENT = Symbol('whistle#proxyAgent');

module.exports = class Whistle extends EventEmitter {
  constructor(app) {
    super();
    this.app = app;
  }

  init({ host, port }) {
    this.host = host;
    this.port = port;

    if (!this.ready) {
      this.ready = true;
      this.emit('ready');
    }
  }

  get proxyUri() {
    if (this.ready && !this[PROXY_WHISTLE_URI]) {
      this[PROXY_WHISTLE_URI] = `http://${this.host}:${this.port}`;
    }

    return this[PROXY_WHISTLE_URI];
  }

  get proxyAgent() {
    if (this.ready && !this[PROXY_WHISTLE_AGENT]) {
      this[PROXY_WHISTLE_AGENT] = new (require('proxy-agent'))(this.proxyUri);
    }

    return this[PROXY_WHISTLE_AGENT];
  }
};

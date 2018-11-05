const PROXY_WHISTLE_URI = Symbol('whistle#proxyUri');
const PROXY_WHISTLE_AGENT = Symbol('whistle#proxyAgent');

module.exports = class Whistle {
  constructor(app, { host, port }) {
    this.app = app;
    this.host = host;
    this.port = port;
  }

  get proxyUri() {
    if (!this[PROXY_WHISTLE_URI]) {
      this[PROXY_WHISTLE_URI] = `http://${this.host}:${this.port}`;
    }

    return this[PROXY_WHISTLE_URI];
  }

  get proxyAgent() {
    if (!this[PROXY_WHISTLE_AGENT]) {
      this[PROXY_WHISTLE_AGENT] = new (require('proxy-agent'))(this.proxyUri);
    }

    return this[PROXY_WHISTLE_AGENT];
  }
};

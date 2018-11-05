module.exports = class Whistle {
  constructor(app, { host, port }) {
    this.app = app;
    this.host = host;
    this.port = port;
  }

  getProxyUri(protocol) {
    return `${protocol || 'http'}://${this.host}:${this.port}`;
  }

  getProxyAgent(protocol) {
    return new (require('proxy-agent'))(this.getProxyUri(protocol));
  }
};

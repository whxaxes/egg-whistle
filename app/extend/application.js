const PROXY_HTTP_CLIENT = Symbol('application#proxyHttpClient');

function proxyclient(app, HttpClient) {
  return class NewHttpClient extends HttpClient {
    request(reqUrl, args = {}, callback) {
      if (app.whistle) {
        const result = reqUrl.match(/^(\w+):\/\//);
        const protocol = result && result[1];
        args.enableProxy = true;
        args.proxy = app.whistle.getProxyUri(protocol);
      }

      return super.request(reqUrl, args, callback);
    }
  };
}

module.exports = {
  get httpclient() {
    if (!this[PROXY_HTTP_CLIENT]) {
      // overwrite HttpClient in app
      this.HttpClient = proxyclient(this, this.HttpClient);
      this.ContextHttpClient = proxyclient(this, this.ContextHttpClient);
      this[PROXY_HTTP_CLIENT] = new (this.HttpClient)(this);
    }

    return this[PROXY_HTTP_CLIENT];
  },
};

const PROXY_HTTP_CLIENT = Symbol('application#proxyHttpClient');

// check ignore request
function checkIgnore(ignore, url) {
  if (!ignore) {
    return false;
  }

  const ignoreList = Array.isArray(ignore) ? ignore : [ ignore ];
  return ignoreList.find(pattern => pattern.test(url));
}

// wrap HttpClient
function proxyclient(app, HttpClient) {
  return class NewHttpClient extends HttpClient {
    request(reqUrl, args = {}, callback) {
      if (app.whistle && !checkIgnore(app.config.whistle.ignore, reqUrl)) {
        args.enableProxy = true;
        args.proxy = app.whistle.proxyUri;
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
      this[PROXY_HTTP_CLIENT] = new this.HttpClient(this);
    }

    return this[PROXY_HTTP_CLIENT];
  },
};

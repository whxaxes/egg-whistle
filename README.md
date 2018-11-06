# egg-whistle

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-whistle.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-whistle
[travis-image]: https://img.shields.io/travis/whxaxes/egg-whistle.svg?style=flat-square
[travis-url]: https://travis-ci.org/whxaxes/egg-whistle
[codecov-image]: https://codecov.io/gh/whxaxes/egg-whistle/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/whxaxes/egg-whistle
[david-image]: https://img.shields.io/david/whxaxes/egg-whistle.svg?style=flat-square
[david-url]: https://david-dm.org/whxaxes/egg-whistle
[snyk-image]: https://snyk.io/test/npm/egg-whistle/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-whistle
[download-image]: https://img.shields.io/npm/dm/egg-whistle.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-whistle

Using whistle in egg application.


## What is whistle

Whistle is a great web debugging tool based on Nodejs.

see https://github.com/avwo/whistle

## Install

```bash
$ npm install egg-whistle --save
```

or 

```bash
$ yarn add egg-whistle --save
```

## Usage

```js
// config/plugin.js

exports.whistle = {
  enable: true,
  env: [ 'local', 'test' ],
  package: 'egg-whistle',
};
```

Starting the egg application and visit `http://{your app host}:{your app port}/__whistle__`

eg.

```bash
$ npx egg-bin dev
```

open whistle

```bash
$ open http://127.0.0.1:7001/__whistle__
```

After application started, The http request client in egg ( `app.httpclient` or `ctx.httpclient` ) will send requests through whistle proxy, and capture the request info in whistle dashboard.

## Proxy Custom Requests

`egg-whistle` only proxy the requests sent by `app.httpclient` or `ctx.httpclient` ( includes `ctx.curl` or `app.curl` ) in egg by default. If you want to proxy your own requests( like `http.request` or `websocket` ), `app.whistle.proxyAgent` may works for you.

http

```js
// app.js

const http = require('http');
module.exports = app => {
  http.request('http://xxx.com/xxx', { agent: app.whistle && app.whistle.proxyAgent })
};
```

websocket

```js
// app.js

const ws = require('WebSocket');
module.exports = app => {
  const socket = new WebSocket('ws://xxx.com/xxx', {
    agent: app.whistle && app.whistle.proxyAgent
  });
};
```

## Configuration

```js
// config/config.default.js

exports.whistle = {
  // route: '/__whistle__', // whistle url
  // ignore: undefined, // Array<RegExp> | RegExp, eg. /\/test\/.*/ or [ /\/test\/.*/ ]
  // storage: path.resolve(appInfo.root, 'logs/whistle'),
  // timeout: 3600,
  // see https://github.com/avwo/whistle to know more configuration
}
```

plugin config

- **route**  whistle dashboard path
- **ignore**  ignore url`Array<RegExp> | RegExp, eg. /\/test\/.*/ or [ /\/test\/.*/ ]` only works for httpclient in egg.

whistle config

See https://github.com/avwo/whistle#install--setup ( support the most configuration of whistle except `localUIHost` `host` `port` `uiport` `version`  )

## Lincense

MIT

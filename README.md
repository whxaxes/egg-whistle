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

Start the egg application and visit `http://{your app host}:{your app port}/__whistle__`

```bash
$ npx egg-bin dev
```

open whistle

```bash
$ open http://127.0.0.1:7001/__whistle__
```

After application started, the request sent by `app.httpclient` or `ctx.httpclient` will be proxy by whistle, and you can debug proxy in whistle dashboard.

## Configuration

```js
// config/config.default.js

exports.whistle = {
  // route: '/__whistle__', // whistle url
  // storage: path.resolve(appInfo.root, 'logs/whistle'),
  // timeout: 3600,
  // see https://github.com/avwo/whistle to know more configuration
}
```

More configuration： https://github.com/avwo/whistle#install--setup ( support the most configuration of whistle except `localUIHost` `host` `port` `uiport` `version`  )

## Lincense

MIT
const mm = require('egg-mock');
const assert = require('assert');
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

describe('test/index.test.js', () => {
  let app;

  afterEach(async () => {
    mm.restore();
    await app.close();
  });

  it('should change HttpClient', async () => {
    app = mm.app({ baseDir: 'app' });
    await app.ready();
    const ctx = app.mockContext();
    await sleep(500);
    await new Promise(resolve => {
      mm(app.whistle, 'getProxyUri', protocol => {
        assert(protocol === 'https');
        resolve();
      });

      ctx.httpclient.curl('https://httptest.cnodejs.net/test/get');
    });

    await new Promise(resolve => {
      mm(app.whistle, 'getProxyUri', protocol => {
        assert(protocol === 'http');
        resolve();
      });

      app.curl('http://httptest.cnodejs.net/test/get');
    });

    await app.close();
  });

  it('should has custom agent', async () => {
    app = mm.app({ baseDir: 'app' });
    await app.ready();
    await sleep(500);
    assert(!!app.whistle.getProxyAgent());
  });

  it('should visit whistle without error', async () => {
    app = mm.cluster({ baseDir: 'app' });
    await app.ready();
    await sleep(500);
    await app
      .httpRequest()
      .get('/__whistle__')
      .expect(200)
      .then(res => {
        assert(res.text.includes('Whistle Web Debugger'));
      });

    await app
      .httpRequest()
      .get('/custom')
      .expect(200)
      .then(res => {
        assert(res.text.includes('666'));
      });
  });

  it('should support custom route', async () => {
    app = mm.cluster({ baseDir: 'custom' });
    await app.ready();
    await sleep(500);
    await app
      .httpRequest()
      .get('/__custom_whistle__')
      .expect(200)
      .then(res => {
        assert(res.text.includes('Whistle Web Debugger'));
      });
  });

  it('should request without error if referer is whistle', async () => {
    app = mm.cluster({ baseDir: 'app' });
    await app.ready();
    await sleep(500);
    await app
      .httpRequest()
      .get('/js/index.js')
      .expect(404);

    await app
      .httpRequest()
      .get('/js/index.js')
      .set('Referer', 'http://127.0.0.1:7001/__whistle__')
      .expect(200);
  });

  it('should request url using proxy without error', async () => {
    app = mm.cluster({ baseDir: 'app' });
    await app.ready();
    await sleep(500);
    await app
      .httpRequest()
      .get('/custom1')
      .expect(200);
    await app
      .httpRequest()
      .get('/custom2')
      .expect(200);
  });

  it('should redirect if visit weinre and referer is whistle', async () => {
    app = mm.cluster({ baseDir: 'app' });
    await app.ready();
    await sleep(500);
    await app
      .httpRequest()
      .get('/weinre/client')
      .set('Referer', 'http://127.0.0.1:7001/__whistle__')
      .expect(302)
      .then(res => {
        assert(res.headers.location === '/__whistle__/weinre/client');
      });
  });

  it('should works with authentication without error', async () => {
    app = mm.cluster({ baseDir: 'auth' });
    await app.ready();
    await sleep(500);
    await app
      .httpRequest()
      .get('/__whistle__')
      .expect(401)
      .then(res => {
        assert(res.text.includes('Access denied'));
      });

    await app
      .httpRequest()
      .get('/__whistle__')
      .set('Authorization', 'Basic ' + new Buffer('test:test').toString('base64'))
      .expect(200)
      .then(res => {
        assert(res.text.includes('Whistle Web Debugger'));
      });
  });
});

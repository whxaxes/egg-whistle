const url = require('url');
const http = require('http');
const through = require('through2');
const sourceRE = /("|')(?:\/)?((?:js|img)\/[^"']+)("|')/g;

module.exports = () => {
  return async function whistleInterceptor(ctx, next) {
    const app = ctx.app;
    const { config } = app;
    const { route } = config.whistle;
    const referer = ctx.get('referer');
    const refererObj = url.parse(referer);
    const isRequestWhistle = ctx.url.startsWith(route);
    const isFromWhistle = refererObj.pathname && refererObj.pathname.startsWith(route);
    if (!app.whistle.port || (!isFromWhistle && !isRequestWhistle)) {
      // normal request
      return next();
    }

    if (
      !isRequestWhistle &&
      isFromWhistle &&
      ctx.method === 'GET' &&
      ctx.get('accept').includes('text/html')
    ) {
      // redirect to whistle if referer is whistle and accept header has `text/html`
      return ctx.redirect(`${route}${ctx.url}`);
    }

    const { host, port } = app.whistle;

    // create proxy server
    const whistleOrigin = app.whistle.proxyUri;
    const server = http.request(
      {
        host,
        port,
        path: isRequestWhistle ? ctx.url.substring(route.length) || '/' : ctx.url,
        method: ctx.method,
        agent: false,
        headers: {
          ...ctx.headers,

          // overwrite host and origin with whistle server
          host,
          origin: whistleOrigin,
        },
      },
      resp => {
        const headers = { ...resp.headers };

        // content-length maybe changed, remove it anyway
        delete headers['content-length'];

        // replace origin to proxy origin
        if (headers['access-control-allow-origin']) {
          headers['access-control-allow-origin'] = ctx.origin;
        }

        // make cookie works in all path.
        const setCookies = headers['set-cookie'];
        if (setCookies && setCookies.length) {
          headers['set-cookie'] = setCookies.map(cookie =>
            cookie.replace(/Path=((?:\/[^\/;]*)+);/, 'Path=/;')
          );
        }

        // add proxy flag to header
        headers['x-proxy-to'] = whistleOrigin;

        let stream = ctx.res;
        const contentType = headers['content-type'] || '';
        if (contentType.includes('text/html')) {
          // replace sources in html
          stream = through.obj((chunk, enc, done) => {
            let info = chunk.toString();
            info = info.replace(sourceRE, (source, l, m, r) => `${l}${route}/${m}${r}`);
            done(null, info);
          });

          stream.pipe(ctx.res);
        }

        // pipe data to response
        ctx.res.writeHead(resp.statusCode, headers);
        resp.pipe(stream);
      }
    );

    ctx.respond = false;
    ctx.req.pipe(server);
  };
};

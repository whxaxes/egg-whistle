const url = require('url');
const http = require('http');

module.exports = () => {
  return async function whistleInterceptor(ctx, next) {
    const app = ctx.app;
    const { config } = app;
    const { route } = config.whistle;
    const referer = ctx.get('referer');
    const refererObj = url.parse(referer);
    const isRequestWhistle = ctx.url.startsWith(route);
    const isFromWhistle = refererObj.pathname && refererObj.pathname.startsWith(route);
    if (!app.whistle || (!isFromWhistle && !isRequestWhistle)) {
      // normal request
      return next();
    }

    if (isFromWhistle && ctx.url.startsWith('/weinre')) {
      // redirect to whistle if referer is whistle but request weinre url
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

        // pipe data to response
        ctx.res.writeHead(resp.statusCode, headers);
        resp.pipe(ctx.res);
      }
    );

    ctx.respond = false;
    ctx.req.pipe(server);
  };
};

module.exports = app => {
  const { router } = app;

  router.get('/custom', async ctx => {
    ctx.body = '666';
  });

  router.get('/custom1', async ctx => {
    ctx.body = await ctx.httpclient.curl('http://httptest.cnodejs.net/test/get');
  });

  router.get('/custom2', async ctx => {
    ctx.body = await ctx.app.curl('http://httptest.cnodejs.net/test/get');
  });
};

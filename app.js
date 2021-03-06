const constant = require('./lib/constant');

module.exports = app => {
  app.config.coreMiddleware.unshift('whistleInterceptor');
  app.messenger.once('egg-ready', () => {
    app.messenger.sendToAgent(constant.SYNC_CONFIG);
    app.messenger.on(constant.SYNC_CONFIG, info => {
      app.whistle.init(info);

      const address = (app.server && app.server.address() || {});
      app.messenger.sendToAgent(constant.APP_WHISTLE_READY, {
        port: address.port || info.port,
      });
    });
  });
};

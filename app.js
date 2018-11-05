const constant = require('./lib/constant');
const Whistle = require('./lib/whistle');

module.exports = app => {
  app.config.coreMiddleware.unshift('whistleInterceptor');
  app.messenger.once('egg-ready', () => {
    app.messenger.sendToAgent(constant.SYNC_CONFIG);
    app.messenger.on(constant.SYNC_CONFIG, info => {
      app.whistle = new Whistle(app, info);
    });
  });
};

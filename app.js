const constant = require('./lib/constant');
const Whistle = require('./lib/whistle');

module.exports = app => {
  app.config.coreMiddleware.unshift('whistleInterceptor');
  app.messenger.once('egg-ready', ({ port }) => {
    app.logger.info(
      `[egg-whistle] whistle started on http://127.0.0.1:${port}${app.config.whistle.route}`
    );

    app.messenger.sendToAgent(constant.SYNC_CONFIG);
    app.messenger.on(constant.SYNC_CONFIG, info => {
      app.whistle = new Whistle(app, info);
    });
  });
};

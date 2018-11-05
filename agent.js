const { fork, exec } = require('child_process');
const getPort = require('get-port');
const constant = require('./lib/constant');
const Whistle = require('./lib/whistle');
const whistleHost = '127.0.0.1';
const addressConfig = {};

module.exports = agent => {
  agent.messenger.on(constant.SYNC_CONFIG, () => {
    if (addressConfig.port) {
      // sync config to app
      agent.messenger.sendToApp(constant.SYNC_CONFIG, addressConfig);
    }
  });

  agent.messenger.on('egg-ready', ({ port }) => {
    agent.logger.info(`[egg-whistle] whistle started on http://127.0.0.1:${port}${agent.config.whistle.route}`);
  });

  agent.beforeStart(async () => {
    const port = await getPort();
    await runWhistle(agent, port)
      .then(() => {
        addressConfig.host = whistleHost;
        addressConfig.port = port;
        agent.whistle = new Whistle(agent, addressConfig);
      })
      .catch(e => {
        agent.logger.error('[egg-whistle] whistle start fail: ' + e.message);
      });
  });
};

function runWhistle(app, port) {
  const config = app.config.whistle;
  const argv = [ 'run', '-l', whistleHost, '-p', port ];
  const logger = app.logger;
  const ignoreConfigList = [ 'help', 'localUIHost', 'host', 'port', 'uiport', 'version', 'route' ];
  Object.keys(config).forEach(k => {
    // ignore some configuration of whistle
    if (config[k] && !ignoreConfigList.includes(k)) {
      argv.push(`--${k}`, config[k]);
    }
  });

  const whistleFile = require.resolve('whistle/bin/whistle.js');
  const ps = fork(whistleFile, argv, { stdio: 'pipe' });
  const exit = () => {
    if (process.platform === 'win32') {
      exec('taskkill /pid ' + ps.pid + ' /T /F');
    } else {
      ps.kill('SIGTERM');
    }
  };

  ps.on('error', e => logger.error(e));
  [ 'uncaughtException', 'exit', 'SIGINT', 'SIGTERM', 'SIGHUP' ].forEach(evt =>
    process.once(evt, exit)
  );

  return new Promise((resolve, reject) => {
    let output = '';
    // timeout on 5000ms
    const tick = setTimeout(() => reject(new Error('whistle start timeout')), 5000);
    const onData = info => {
      output += info;
      if (output.match(/whistle@[\d.]+ started/)) {
        ps.stdout.removeListener('data', onData);
        clearTimeout(tick);
        resolve();
      }
    };

    ps.stdout.setEncoding('utf8');
    ps.stdout.on('data', onData);
  });
}

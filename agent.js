const { spawn, exec } = require('child_process');
const getPort = require('get-port');
const constant = require('./lib/constant');
const Whistle = require('./lib/whistle');
const whistleHost = '127.0.0.1';
const addressConfig = {};

module.exports = agent => {
  agent.beforeStart(async () => {
    const port = await getPort();
    addressConfig.host = whistleHost;
    addressConfig.port = port;
    agent.whistle = new Whistle(agent, addressConfig);
    runWhistle(agent, port);
  });

  agent.messenger.on(constant.SYNC_CONFIG, () => {
    if (!addressConfig.port) {
      return;
    }

    // sync config to app
    agent.messenger.sendToApp(constant.SYNC_CONFIG, addressConfig);
  });
};

async function runWhistle(app, port) {
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

  const ps = spawn('whistle', argv);
  const exit = () => {
    if (process.platform === 'win32') {
      exec('taskkill /pid ' + ps.pid + ' /T /F');
    } else {
      ps.kill('SIGTERM');
    }
  };

  ps.on('error', e => logger.error(e));
  process.on('uncaughtException', exit);
  process.on('exit', exit);
  process.on('SIGINT', exit);
  process.on('SIGTERM', exit);
  process.on('SIGHUP', exit);

  return {
    ps,
    exit,
  };
}

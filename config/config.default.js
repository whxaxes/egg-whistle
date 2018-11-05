const path = require('path');

module.exports = appInfo => {
  return {
    whistle: {
      route: '/__whistle__',
      storage: path.resolve(appInfo.root, 'logs/whistle'),
      // see https://github.com/avwo/whistle to know more configuration
    },
  };
};

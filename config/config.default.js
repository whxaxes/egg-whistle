const path = require('path');

module.exports = appInfo => {
  return {
    whistle: {
      route: '/__whistle__',

      // Array<RegExp> | RegExp, eg. /\/test\/.*/ or [ /\/test\/.*/ ]
      ignore: undefined,

      storage: path.resolve(appInfo.root, 'logs/whistle'),
      // see https://github.com/avwo/whistle to know more configuration
    },
  };
};

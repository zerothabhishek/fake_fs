
const rewireMobX = require('react-app-rewire-mobx');
const rewireTypescript = require('react-app-rewire-typescript');

module.exports = function override(config, env) {
  config = rewireMobX(config, env);
  config = rewireTypescript(config, env);
  return config;
}

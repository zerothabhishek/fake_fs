
const rewireMobX = require('react-app-rewire-mobx');
const rewireTypescript = require('react-app-rewire-typescript');

// Run 'npm link typescript' to get this to work

module.exports = function override(config, env) {
  config = rewireMobX(config, env);
  config = rewireTypescript(config, env);
  return config;
}

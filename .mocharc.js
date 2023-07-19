// https://github.com/mochajs/mocha/blob/master/example/config/.mocharc.js

module.exports = {
  extension: 'ts',
  require: ['ts-node/register', 'test/init'],
  timeout: 30000,
};

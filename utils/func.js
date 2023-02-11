const moment = require('moment');
const { TIME_DATE_STR } = require('./constants');

const now = () => `[${moment().format(TIME_DATE_STR)}]`;
const log = (...messages) => console.log('\x1b[32m', now(), '-', ...messages, '\x1b[0m');
const logWithoutTime = (...messages) => console.log('\x1b[32m', '                         ', ...messages, '\x1b[0m');
const err = (...messages) => console.error('\x1b[31m', now(), '-', ...messages, '\x1b[0m');
const errWithoutTime = (...messages) => console.error('\x1b[31m', '                         ', ...messages, '\x1b[0m');

module.exports = {
  now, log, err, logWithoutTime, errWithoutTime,
};

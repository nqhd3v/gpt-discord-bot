const {
  appendFile, readFile, writeFile,
} = require('fs/promises');
const path = require('path');
const moment = require('moment');
const { err: error, logMsg, errMsg } = require('./func');

const isFileExist = async (filepath) => {
  if (process.env.DISABLE_LOG_FILE) {
    return false;
  }
  try {
    await readFile(filepath);
    return true;
  } catch (e) {
    return false;
  }
};

const addLog = async (content, isError = false, namePrefix = '') => {
  if (process.env.DISABLE_LOG_FILE) {
    return false;
  }
  const current = moment().format('YYYY-MM');
  try {
    const filepath = namePrefix
      ? path.join(process.cwd(), './logs', `${namePrefix}.${current}.log`)
      : path.join(process.cwd(), './logs', `${current}.log`);
    const isExist = await isFileExist(filepath);
    const content2Add = isError
      ? `${errMsg(content)}\n`
      : `${logMsg(content)}\n`;
    if (isExist) {
      const res = await appendFile(filepath, content2Add);
      return res;
    }
    const res = await writeFile(filepath, content2Add, { encoding: 'utf8' });
    return res;
  } catch (err) {
    error('Err when append file', err);
    throw err;
  }
};

/**
 *
 * @param {string} path
 * @returns {string} filepath after create (or current)
 */
const getLogFile = async (folderPath = '/logs') => {
  if (process.env.DISABLE_LOG_FILE) {
    return false;
  }
  const current = moment().format('YYYY-MM');
  const logFile = path.join(folderPath, `${current}.log`);
  const res = await readFile(logFile, { encoding: 'utf-8' });
  return res;
};

module.exports = {
  addLog, getLogFile,
};

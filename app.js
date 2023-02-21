const express = require('express');
const bot = require('./bot');
const { log } = require('./utils/func');

const app = express();

// Create GET request
app.get('/', (req, res) => {
  res.send('Express on Vercel');
});

// Initialize server
app.listen(50000, async () => {
  log('App running on port 5000.');
  await bot.startBot();
});

module.exports = app;

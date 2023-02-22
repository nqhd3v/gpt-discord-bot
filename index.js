const Eris = require('eris');
const { Configuration, OpenAIApi } = require('openai');
const { addLog } = require('./utils/file');
const {
  log, err, logWithoutTime, errWithoutTime,
} = require('./utils/func');
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const bot = new Eris(process.env.DISCORD_BOT_TOKEN, {
  intents: [
    'guildMessages',
  ],
});

async function runCompletion(message) {
  const completion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: message,
    max_tokens: 200,
  });
  return completion.data.choices[0].text;
}

bot.on('ready', async () => {
  log('Bot is running...');
  await addLog('Bot is ready to receive request from client....');
});

bot.on('error', async (error) => {
  err('Error when reply for new message:');
  errWithoutTime(error);
  await addLog(`Error when handle request: ${error}`, true);
});
bot.on('messageCreate', async (msg) => {
  if (/^@@ /.test(msg.content)) {
    log(`New message from '${msg.author.username}#${msg.author.id}':`);
    const question = msg.content.replace('@@ ', '');
    logWithoutTime(`"${question}"`);
    const botMsg = await runCompletion(question);
    await bot.createMessage(msg.channel.id, botMsg);
  }
  await addLog(`${msg.author.username}#${msg.author.id} - "${msg.content}"`, false, 'msg');
});

const startBot = async () => {
  log('Starting bot...');
  await bot.connect();
};

startBot();

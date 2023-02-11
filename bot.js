const Eris = require('eris');
const { Configuration, OpenAIApi } = require('openai');
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

bot.on('ready', () => {
  log('Bot is running...');
});

bot.on('error', (error) => {
  err('Error when reply for new message:');
  errWithoutTime(error);
});

bot.on('messageCreate', async (msg) => {
  // log('New message:', msg);
  if (/^#gpt /.test(msg.content)) {
    log(`New message from '${msg.author.username}#${msg.author.id}':`);
    const question = msg.content.replace('#gpt ', '');
    logWithoutTime(`"${question}"`);
    const botMsg = await runCompletion(question);
    await bot.createMessage(msg.channel.id, botMsg);
  }
});

bot.connect();

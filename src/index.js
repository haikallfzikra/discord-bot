const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const fetch = require('node-fetch');


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.TOKEN;

client.once('ready', () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.content === '!ping') {
    message.reply('Pong!');
  } else if (message.content === '!jokes') {
    try {
      const res = await fetch('https://jokesbapak2.reinaldyrafli.com/api/');
      const data = await res.json();
      message.reply(data.joke || '😅 Waduh, jokes-nya ngilang...');
    } catch (err) {
      console.error('❌ Error ambil jokes:', err);
      message.reply('⚠️ Gagal ambil jokes. Coba lagi nanti ya.');
    }
  }
});


client.login(TOKEN);

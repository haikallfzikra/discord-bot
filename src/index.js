const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
require('dotenv').config();
const axios = require('axios');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const TOKEN = process.env.TOKEN;

client.once('ready', () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});


const candaFunction = async () => {
  try {
    const apiUrl = "https://candaan-api.vercel.app/api/image/random";
    const response = await axios.get(apiUrl);

    const imageUrl = response.data.data.url;

    return imageUrl;
  } catch (err) {
    console.error('Error ambil jokes:', err);
    return 'Gagal ambil jokes. Coba lagi nanti ya.';
  }
};

const jokesFunction = async () => {
  try {
    const apiUrl = `https://jokesbapak2.reinaldyrafli.com/api/?nocache=${Date.now()}`;
    return apiUrl;
  } catch (err) {
    console.error('Error ambil jokes:', err);
    return 'Gagal ambil jokes. Coba lagi nanti ya.';
  }
};

const textFunction = async () => {
  const data = 'https://candaan-api.vercel.app/api/text/random';
  try {
    const response = await axios.get(data);
    const text = response.data.message;

    if (!text) {
      await message.reply('Teks kosong diterima. Coba lagi nanti.');
      return;
    }
    await message.reply(text);
  } catch (err) {
    console.error('Error ambil teks:', err);
    await message.reply('Gagal ambil teks. Coba lagi nanti ya.');
  }
};

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!text') {
    try {
      await textFunction();
    } catch (err) {
      console.error('Error ambil teks:', err);
      message.reply('Gagal ambil teks. Coba lagi nanti ya.');
    }
  } else if (message.content === '!jokes') {
    try {
      const imageUrl = await jokesFunction();
      const attachment = new AttachmentBuilder(imageUrl, { name: 'jokesbapak.jpg' });
      await message.channel.send({
        content: 'Berikut adalah gambar jokes bapack:',
        files: [attachment]
      });

    } catch (err) {
      console.error('Error ambil jokes:', err);
      message.reply('Gagal ambil jokes. Coba lagi nanti ya.');
    }
  } else if (message.content === '!tolong') {
    message.reply('Gunakan !ping untuk balasan cepat, !jokes untuk mendapatkan gambar jokes, atau !help untuk bantuan.');
  } else if (message.content === '!inpo') {
    message.reply('Bot ini dibuat untuk memberikan balasan cepat dan gambar lucu. Gunakan perintah yang tersedia untuk berinteraksi!');
  } else if (message.content === '!canda') {
      const imageUrl = await candaFunction();
      const attachment = new AttachmentBuilder(imageUrl, { name: 'canda.jpg' });
      await message.channel.send({
        content: 'Berikut adalah gambar jokes biasa:',
        files: [attachment]
      });
  }
});

client.login(TOKEN);


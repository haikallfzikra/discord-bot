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
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content === '!text') {
    const data = 'https://candaan-api.vercel.app/api/text/random';
    try {
      const response = await axios.get(data);
      const text = response.data.data.text;
      message.reply(text);
    } catch (err) {
      console.error('Error ambil teks:', err);
      message.reply('Gagal ambil teks. Coba lagi nanti ya.');
    }

  } else if (message.content === '!jokes') {
    try {
      const imageUrl = `https://jokesbapak2.reinaldyrafli.com/api/?nocache=${Date.now()}`;
      const attachment = new AttachmentBuilder(imageUrl, { name: 'jokesbapak.jpg' });
      await message.channel.send({
        files: [attachment]
      });

    } catch (err) {
      console.error('❌ Error ambil jokes:', err);
      message.reply('⚠️ Gagal ambil jokes. Coba lagi nanti ya.');
    }
  } else if (message.content === '!help') {
    message.reply('Gunakan !ping untuk balasan cepat, !jokes untuk mendapatkan gambar jokes, atau !help untuk bantuan.');
  } else if (message.content === '!info') {
    message.reply('Bot ini dibuat untuk memberikan balasan cepat dan gambar lucu. Gunakan perintah yang tersedia untuk berinteraksi!');
  } else if (message.content === '!canda') {
    try {
      const apiUrl = "https://candaan-api.vercel.app/api/image/random";
      const response = await axios.get(apiUrl);

      const imageUrl = response.data.data.url;

      const attachment = new AttachmentBuilder(imageUrl, { name: 'canda.jpg' });
      await message.channel.send({
        files: [attachment]
      });

    } catch (err) {
      console.error('❌ Error ambil jokes:', err);
      message.reply('⚠️ Gagal ambil jokes. Coba lagi nanti ya.');
    }
  }
});

client.login(TOKEN);


const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const axios = require('axios'); 
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

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
  const url = 'https://candaan-api.vercel.app/api/text/random';
  try {
    const response = await axios.get(url);
    const text = response.data.data;

    console.log('Teks yang diambil:', text);
    

    if (!text || typeof text !== 'string') {
      return null;
    }

    return text;
  } catch (err) {
    console.error('Error ambil teks:', err);
    return null;
  }
};

client.once('ready', () => {
  console.log(`🤖 Bot ready as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'text') {
    const text = await textFunction();
    await interaction.reply(text || '⚠️ Gagal ambil teks. Coba lagi nanti ya.');

  } else if (commandName === 'jokes') {
    try {
      const imageUrl = await jokesFunction();
      const attachment = new AttachmentBuilder(imageUrl, { name: 'jokesbapak.jpg' });
      await interaction.reply({ content: 'Berikut adalah gambar jokes bapack:', files: [attachment] });
    } catch (err) {
      console.error('Error ambil jokes:', err);
      await interaction.reply('Gagal ambil jokes. Coba lagi nanti ya.');
    }

  } else if (commandName === 'canda') {
    const imageUrl = await candaFunction();
    const attachment = new AttachmentBuilder(imageUrl, { name: 'canda.jpg' });
    await interaction.reply({ content: 'Berikut adalah gambar jokes biasa:', files: [attachment] });

  } else if (commandName === 'tolong') {
    await interaction.reply('Gunakan `/text`, `/jokes`, `/canda`, atau `/inpo` untuk mulai.');

  } else if (commandName === 'inpo') {
    await interaction.reply('Bot ini dibuat untuk memberikan balasan cepat dan gambar lucu. Gunakan slash command untuk berinteraksi!');
  }
});

client.login(process.env.TOKEN);

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();


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

  if (message.content === '!ping') {
    message.reply('Pong!');
  } else if (message.content === '!jokes') {
    try {
      const imageUrl = `https://jokesbapak2.reinaldyrafli.com/api/?nocache=${Date.now()}`;
          
      const embed = new EmbedBuilder()
        .setTitle('🤣 Jokes Bapak-Bapak')
        .setImage(imageUrl)
        .setColor('#ffaa00')
        .setFooter({ text: 'Powered by jokesbapak2.reinaldyrafli.com' })
        .setTimestamp();
          
      await message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Error ambil jokes:', err);
      message.reply('⚠️ Gagal ambil jokes. Coba lagi nanti ya.');
    }
  }
});


client.login(TOKEN);

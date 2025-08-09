const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeExtractor } = require('@discord-player/youtube');
const { SpotifyExtractor } = require('@discord-player/spotify');
const { SoundCloudExtractor } = require('@discord-player/soundcloud');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Setup discord-player
const player = new Player(client);

(async () => {
    await player.extractors.register(YoutubeExtractor, {});
    await player.extractors.register(SpotifyExtractor, {});
    await player.extractors.register(SoundCloudExtractor, {});
})();

const candaFunction = async () => {
  try {
    const apiUrl = "https://candaan-api.vercel.app/api/image/random";
    const response = await axios.get(apiUrl);
    return response.data.data.url;
  } catch (err) {
    console.error('Error ambil jokes:', err);
    return null;
  }
};

const jokesFunction = async () => {
  try {
    return `https://jokesbapak2.reinaldyrafli.com/api/?nocache=${Date.now()}`;
  } catch (err) {
    console.error('Error ambil jokes:', err);
    return null;
  }
};

const textFunction = async () => {
  try {
    const response = await axios.get('https://candaan-api.vercel.app/api/text/random');
    return typeof response.data.data === 'string' ? response.data.data : null;
  } catch (err) {
    console.error('Error ambil teks:', err);
    return null;
  }
};

// ======== Event Ready ========
client.once('ready', () => {
  console.log(`🤖 Bot login sebagai ${client.user.tag}`);
});

// ======== Interaction Handler ========
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      // === Command hiburan ===
      case 'text':
        const text = await textFunction();
        await interaction.reply(text || '❌ Gagal mengambil teks.');
        break;

      case 'jokes':
        const jokesUrl = await jokesFunction();
        if (jokesUrl) {
          await interaction.reply({ files: [new AttachmentBuilder(jokesUrl)] });
        } else {
          await interaction.reply('❌ Gagal mengambil gambar jokes.');
        }
        break;

      case 'canda':
        const candaImage = await candaFunction();
        if (candaImage) {
          await interaction.reply({ files: [new AttachmentBuilder(candaImage)] });
        } else {
          await interaction.reply('❌ Gagal mengambil gambar canda.');
        }
        break;

      case 'tolong':
        await interaction.reply('Gunakan `/text`, `/jokes`, `/canda`, `/play`, `/skip`, `/stop`.');
        break;

      case 'inpo':
        await interaction.reply('Bot hiburan & musik 🎵. Gunakan `/text`, `/jokes`, `/canda`, `/play`.');
        break;

      // === Command musik ===
      case 'play':
          const query = interaction.options.getString('url');
          if (!query) return interaction.reply('❌ Masukkan URL atau nama lagu.');
      
          if (!interaction.member.voice.channel) {
              return interaction.reply('❌ Kamu harus berada di voice channel.');
          }
        
          await interaction.deferReply();
        
          const searchResult = await player.search(query, {
              requestedBy: interaction.user
          });
        
          if (!searchResult || !searchResult.tracks.length) {
              return interaction.editReply('❌ Lagu tidak ditemukan.');
          }
        
          const queue = player.nodes.create(interaction.guild, {
              metadata: interaction.channel
          });

          try {
              if (!queue.connection) await queue.connect(interaction.member.voice.channel);
          } catch {
              queue.delete();
              return interaction.editReply('❌ Gagal masuk ke voice channel.');
          }
          queue.addTrack(searchResult.tracks[0]);
          if (!queue.isPlaying()) await queue.node.play();
          return interaction.editReply(`✅ Ditambahkan ke antrian: **${searchResult.tracks[0].title}**`);

      case 'skip':
        const currentQueue = player.getQueue(interaction.guild.id);
        if (!currentQueue) return interaction.reply('❌ Tidak ada musik yang sedang diputar.');
        currentQueue.skip();
        interaction.reply('⏭ Lagu dilewati.');
        break;

      case 'stop':
        const stopQueue = player.getQueue(interaction.guild.id);
        if (!stopQueue) return interaction.reply('❌ Tidak ada musik yang sedang diputar.');
        stopQueue.destroy();
        interaction.reply('⏹ Musik dihentikan.');
        break;

      default:
        interaction.reply('❌ Perintah tidak dikenali.');
        break;
    }
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      interaction.reply('⚠️ Terjadi kesalahan saat memproses perintah.');
    }
  }
});

client.login(process.env.TOKEN);

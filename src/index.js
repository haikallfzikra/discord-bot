const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const { 
  joinVoiceChannel, 
  createAudioPlayer, 
  createAudioResource, 
  AudioPlayerStatus, 
  VoiceConnectionStatus, 
  entersState 
} = require('@discordjs/voice');
const axios = require('axios');
const playdl = require("play-dl"); 
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let queue = [];
let player = createAudioPlayer();
let connection;

async function playSong(interaction) {
  if (!queue.length) {
    await interaction.channel.send("✅ Daftar lagu kosong, keluar dari voice channel...");
    if (connection) {
      connection.destroy();
      connection = null;
    }
    return;
  }

  let song = queue[0];

  if (!song.url || !/^https?:\/\//.test(song.url)) {
    await interaction.channel.send(`❌ Lagu "${song.title || 'Tanpa Judul'}" punya URL tidak valid, skip...`);
    queue.shift();
    return playSong(interaction);
  }

  await interaction.channel.send(`🎵 Memutar: **${song.title}**`);

  try {
    let stream = await playdl.stream(song.url, { discordPlayerCompatibility: true });
    let resource = createAudioResource(stream.stream, { 
      inputType: stream.type,
      inlineVolume: true 
    });

    player.play(resource);
    connection.subscribe(player);
  } catch (err) {
    console.error('❌ Error saat memutar lagu:', err);
    await interaction.channel.send(`❌ Gagal memutar lagu "${song.title}", skip...`);
    queue.shift();
    return playSong(interaction);
  }
}

player.on(AudioPlayerStatus.Idle, () => {
  if (queue.length > 0) {
    queue.shift();
    if (queue.length > 0) {
      playSong(lastInteraction);
    }
  }
});

let lastInteraction = null;

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

  try {
    switch (commandName) {
      case 'text':
        const text = await textFunction();
        if (text) {
          await interaction.reply(text);
        } else {
          await interaction.reply('Gagal mengambil teks. Coba lagi nanti ya.');
        }
        break;

      case 'jokes':
        const jokesUrl = await jokesFunction();
        if (jokesUrl) {
          const attachment = new AttachmentBuilder(jokesUrl);
          await interaction.reply({ files: [attachment] });
        } else {
          await interaction.reply('Gagal mengambil gambar jokes. Coba lagi nanti ya.');
        }
        break;
      case 'tolong':
        await interaction.reply('Gunakan perintah `/text`, `/jokes`, atau `/canda` untuk berinteraksi dengan bot ini.');
        break;

      case 'inpo':
        await interaction.reply('Bot ini dibuat untuk memberikan hiburan dengan teks dan gambar jokes. Gunakan perintah `/text`, `/jokes`, atau `/canda` untuk berinteraksi.');
        break;

      case 'canda':
        const candaImage = await candaFunction();
        if (candaImage) {
          const attachment = new AttachmentBuilder(candaImage);
          await interaction.reply({ files: [attachment] });
        } else {
          await interaction.reply('Gagal mengambil gambar canda. Coba lagi nanti ya.');
        }
        break;

    case 'play':
      const url = interaction.options.getString('url');
      if (!url || !/^https?:\/\//.test(url)) {
        return interaction.reply('❌ URL tidak valid. Pastikan formatnya lengkap, contoh: https://youtu.be/...');
      }
    
      lastInteraction = interaction; // simpan interaction terakhir
    
      if (!interaction.member.voice.channel) {
        return interaction.reply('❌ Anda harus berada di voice channel untuk memutar musik.');
      }
    
      if (!connection) {
        connection = joinVoiceChannel({
          channelId: interaction.member.voice.channel.id,
          guildId: interaction.guild.id,
          adapterCreator: interaction.guild.voiceAdapterCreator,
        });
      
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
      }
    
      try {
        const songInfo = await playdl.video_info(url);
        const song = {
          title: songInfo.video_details.title,
          url: songInfo.video_details.url,
        };
        queue.push(song);
        await interaction.reply(`✅ Lagu **${song.title}** ditambahkan ke antrian.`);
      
        if (player.state.status === AudioPlayerStatus.Idle) {
          playSong(interaction);
        }
      } catch (err) {
        console.error('❌ Gagal ambil info video:', err);
        await interaction.reply('❌ Gagal mengambil informasi lagu dari URL tersebut.');
      }
      break;
        
      case 'stop':
        if (connection) {
          connection.destroy();
          connection = null;
          queue = [];
          await interaction.reply('✅ Musik dihentikan dan keluar dari voice channel.');
        } else {
          await interaction.reply('Tidak ada musik yang sedang diputar.');
        }
        break;

      case 'skip':
        if (queue.length > 0) {
          queue.shift();
          await interaction.reply('✅ Lagu saat ini dilewati.');
          if (player.state.status !== AudioPlayerStatus.Playing) {
            playSong(interaction);
          }
        }
        else {
          await interaction.reply('Tidak ada lagu yang sedang diputar.');
        }
        break;
        
      default:
        await interaction.reply('Perintah tidak dikenali. Gunakan `/tolong` untuk bantuan.');
        break;
  }
  } catch (error) {
    console.error('Error handling interaction:', error);
    await interaction.reply('Terjadi kesalahan saat memproses perintah. Coba lagi nanti ya.');
  }
});

client.login(process.env.TOKEN);

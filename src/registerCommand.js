const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder().setName('text').setDescription('Menampilkan teks'),
  new SlashCommandBuilder().setName('jokes').setDescription('Menampilkan gambar jokes bapack'),
  new SlashCommandBuilder().setName('tolong').setDescription('Menampilkan bantuan'),
  new SlashCommandBuilder().setName('inpo').setDescription('Menampilkan informasi bot'),
  new SlashCommandBuilder().setName('canda').setDescription('Menampilkan gambar jokes biasa'),
  new SlashCommandBuilder().setName('play').setDescription('Memutar musik dari YouTube')
    .addStringOption(option => option.setName('url').setDescription('URL video YouTube yang ingin diputar').setRequired(true)),
  new SlashCommandBuilder().setName('stop').setDescription('Menghentikan pemutaran musik'),
  new SlashCommandBuilder().setName('skip').setDescription('Melewati lagu yang sedang diputar'),
    
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log('Slash commands registered!');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
})();

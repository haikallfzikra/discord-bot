const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder().setName('text').setDescription('Menampilkan teks'),
  new SlashCommandBuilder().setName('jokes').setDescription('Menampilkan gambar jokes bapack'),
  new SlashCommandBuilder().setName('tolong').setDescription('Menampilkan bantuan'),
  new SlashCommandBuilder().setName('inpo').setDescription('Menampilkan informasi bot'),
  new SlashCommandBuilder().setName('canda').setDescription('Menampilkan gambar jokes biasa')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Slash commands registered successfully!');
  } catch (error) {
    console.error('❌ Error registering slash commands:', error);
  }
})();

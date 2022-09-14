import { SlashCommandBuilder } from 'discord.js';

export const PingCommand = Object.assign(
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('혹시 저랑 🏓가 치고 싶으신건가요??')
    .toJSON(),
  {
    allowedGuilds: [] as string[],
  },
);

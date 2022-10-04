import { SlashCommandBuilder } from 'discord.js';

export const ProfileCommand = Object.assign(
  new SlashCommandBuilder()
    .setName('profile')
    .setDescription('내 프로필 혹은 누군가의 프로필 보기')
    .setDMPermission(false)
    .addUserOption((option) => option.setName('user').setDescription('열람할 대상'))
    .toJSON(),
  { allowedGuilds: [] },
);

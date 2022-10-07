import { Client, GatewayIntentBits } from 'discord.js';
import { Container } from 'typedi';

import { DISCORD_CLIENT } from '../constant.js';

export default () => {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });
  Container.set(DISCORD_CLIENT, client);

  return client;
};

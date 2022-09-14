import { Client, type ClientOptions } from 'discord.js';
import Container from 'typedi';
import { DISCORD_CLIENT } from '../constant';

export function createDiscordClient(options: ClientOptions) {
  const client = new Client(options);
  Container.set(DISCORD_CLIENT, client);

  return client;
}

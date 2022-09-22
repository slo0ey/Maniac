import 'reflect-metadata';
import { GatewayIntentBits } from 'discord.js';
import { Arguments, Command } from './command.js';
import { createDiscordClient } from './utils/client.js';
import { createCommandMap } from './utils/command.js';
import { Container } from 'typedi';
import readdir from 'readdirp';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createLogger, logWithStack } from './utils/logger.js';
import Event from './event.js';
import { registerCommands } from './rest.js';

if(process.env.NODE_ENV !== 'production') {
  const dotenv = await import('dotenv');
  dotenv.config();
}

const client = createDiscordClient({
  intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences],
});

const logger = createLogger();
const commandMap = createCommandMap();

try {
  const commandFiles = readdir(fileURLToPath(new URL('commands', import.meta.url)), {
    fileFilter: '*.js',
  });
  for await (const file of commandFiles) {
    const module = await import(pathToFileURL(file.fullPath).href);
    const command = Container.get(module.default) as Command<Arguments>;

    commandMap.set(command.name, command);

    logger.debug(`Command '${command.name}' puts info commandMap.`);
  }

  const eventFiles = readdir(fileURLToPath(new URL('events', import.meta.url)), {
    fileFilter: '*.js',
  });

  for await (const file of eventFiles) {
    const module = await import(pathToFileURL(file.fullPath).href);
    const event = Container.get(module.default) as Event;

    event.listen();

    logger.debug(`Listening an event '${event.name}'.`);
  }

  await registerCommands();
  await client.login(process.env.TOKEN);
} catch (err) {
  const error = err as Error;
  logger.error(logWithStack('An error has occurred while login to discord', error));
}

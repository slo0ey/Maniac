import { REST, type RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { LOGGER } from './constant.js';
import { PingCommand } from './interactions/index.js';
import { logWithStack } from './utils/logger.js';

export default async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!!);
  const logger = Container.get(LOGGER) as Logger;

  const commands = [PingCommand];

  try {
    logger.info('Registering slash commands');

    const DISCORD_CLIENT = process.env.DISCORD_CLIENT!;
    const groups = commands.reduce(
      (accumulator, { allowedGuilds, ...info }) => {
        if (allowedGuilds.length > 0) {
          for (const guild of allowedGuilds) {
            if (!accumulator[guild]) {
              accumulator[guild] = [];
            }
            accumulator[guild].push(info);
          }
        } else {
          accumulator['_global'].push(info);
        }
        return accumulator;
      },
      { _global: [] } as { [k: string]: RESTPostAPIApplicationCommandsJSONBody[] },
    );

    logger.debug(`Grouped command: ${JSON.stringify(groups, null, 2)}`);

    for await (const group of Object.entries(groups)) {
      const [guild, commands] = group;

      if (guild === '_global') {
        logger.info(`Registering ${commands.length} commands as Global`);
        logger.debug('Command List: \n' + commands.map((v) => v.name).join('\n'));

        await rest.put(Routes.applicationCommands(DISCORD_CLIENT), { body: commands });
      } else {
        logger.info(`Registering ${commands.length} commands as Guild<${guild}>`);
        logger.debug('Command List: \n' + commands.map((v) => v.name).join('\n'));

        await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT, guild), {
          body: commands,
        });
      }
    }

    logger.info('Register commands successfully!');
  } catch (err) {
    const error = err as Error;
    logger.error(
      logWithStack('An error has occurred while register slash commands', error),
    );
  }
};

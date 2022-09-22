import { Client, Events } from 'discord.js';
import { Inject, Service } from 'typedi';
import winston from 'winston';

import { Arguments, Command } from '../command.js';
import { COMMAND_MAP, DISCORD_CLIENT, LOGGER } from '../constant.js';
import Event from '../event.js';
import { argumentOf } from '../utils/argumentOf.js';
import { logWithStack } from '../utils/logger.js';

@Service()
export default class extends Event {
  public constructor(
    @Inject(DISCORD_CLIENT) public readonly client: Client<true>,
    @Inject(LOGGER) public readonly logger: winston.Logger,
    @Inject(COMMAND_MAP) public readonly commandMap: Map<string, Command<Arguments>>,
  ) {
    super(Events.InteractionCreate);
  }

  public listen() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (interaction.isChatInputCommand()) {
        const {
          commandName,
          options: { data },
        } = interaction;
        const command = this.commandMap.get(commandName.toLowerCase());

        if (command) {
          this.logger.info(
            `Attempt to invoke slash command: ${commandName.toLowerCase()}`,
          );
          try {
            command.chatInput(interaction, argumentOf(data, command));
          } catch (err) {
            const error = err as Error;
            this.logger.error(
              logWithStack(
                `An error has occurred while attempt to invoke slash command: ${commandName.toLowerCase()}`,
                error,
              ),
            );
          }
        }
      }
    });
  }
}

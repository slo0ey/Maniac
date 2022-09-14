import { Client, Events } from 'discord.js';
import { Inject } from 'typedi';
import { Logger } from 'winston';
import { Arguments, Command } from '../command';
import { COMMAND_MAP, DISCORD_CLIENT, LOGGER } from '../constant';
import Event from '../event';
import { argumentOf } from '../utils/argumentOf';
import { logWithStack } from '../utils/logger';

export default class extends Event {
  public constructor(
    @Inject(DISCORD_CLIENT) public readonly client: Client<true>,
    @Inject(LOGGER) public readonly logger: Logger,
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

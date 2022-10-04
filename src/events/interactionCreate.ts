import { Client, Events } from 'discord.js';
import { Inject, Service } from 'typedi';
import winston from 'winston';

import { Arguments, Command } from '../command.js';
import { COMMAND_MAP, DISCORD_CLIENT, LOGGER } from '../constant.js';
import Event from '../event.js';
import { logWithStack } from '../utils/logger.js';

@Service()
export default class extends Event {
  public constructor(
    @Inject(DISCORD_CLIENT) private readonly client: Client<true>,
    @Inject(LOGGER) private readonly logger: winston.Logger,
    @Inject(COMMAND_MAP) private readonly commandMap: Map<string, Command<Arguments>>,
  ) {
    super('interactionCreate');
  }

  public override listen() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      this.logger.info(interaction.guild);
      this.logger.info(interaction.channel);
      if (interaction.isChatInputCommand()) {
        const {
          commandName,
          options: { data },
        } = interaction;
        const command = this.commandMap.get(commandName.toLowerCase());

        if (command) {
          this.logger.info(`Attempt to invoke slash command: ${commandName.toLowerCase()}`);
          try {
            await command.chatInput(interaction, command.translateArguments(data));
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
      } else if (interaction.isButton()) {
        const [commandName, customId, ...args] = interaction.customId.split('|');
        const command = this.commandMap.get(commandName);

        if (command) {
          this.logger.info(`Attempt to invoke button event: ${customId}`);
          try {
            await command.buttonClick(interaction, customId, ...args);
          } catch (err) {
            const error = err as Error;
            this.logger.error(
              logWithStack(
                `An error has occurred while attempt to invoke button event: ${customId}`,
                error,
              ),
            );
          }
        }
      }
    });
  }
}

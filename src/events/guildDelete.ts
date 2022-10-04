import { Client, Events, Guild } from 'discord.js';
import { Inject, Container, Service } from 'typedi';
import winston from 'winston';

import { DISCORD_CLIENT, LOGGER } from '../constant.js';
import GuildDatabase from '../db/guild.js';
import Event from '../event.js';

@Service()
export default class extends Event {
  private readonly guildDB: GuildDatabase;

  public constructor(
    @Inject(DISCORD_CLIENT) private readonly client: Client<true>,
    @Inject(LOGGER) private readonly logger: winston.Logger,
  ) {
    super('guildDelete');
    this.guildDB = Container.get(GuildDatabase);
  }

  public override listen(): void | Promise<void> {
    this.client.on(Events.GuildDelete, async (guild: Guild) => {
      const { id } = guild;

      this.logger.info(`Bot left from guild: ${id}`);
    });
  }
}

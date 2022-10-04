import { Client, Events, Guild } from 'discord.js';
import { Inject, Container, Service } from 'typedi';
import winston from 'winston';

import ManiacGuild from '../api/impl/guild.js';
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
    super('guildCreate');
    this.guildDB = Container.get(GuildDatabase);
  }

  public override listen(): void | Promise<void> {
    this.client.on(Events.GuildCreate, async (guild: Guild) => {
      const { id } = guild;
      const info = await this.guildDB.get(id);

      if (!info) {
        const newInfo = ManiacGuild.create({ id, game_channels: [] });
        await this.guildDB.insert(newInfo);
      }

      this.logger.info(`Bot invited from guild: ${id}`);
    });
  }
}

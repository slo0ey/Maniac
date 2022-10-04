import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import { Client, Events } from 'discord.js';
import { Inject, Service } from 'typedi';
import winston from 'winston';

import { DISCORD_CLIENT, LOGGER } from '../constant.js';
import Event from '../event.js';

@Service()
export default class extends Event {
  public constructor(
    @Inject(DISCORD_CLIENT) readonly client: Client<true>,
    @Inject(LOGGER) readonly logger: winston.Logger,
  ) {
    super('ready');
  }

  public override listen() {
    this.client.on(Events.ClientReady, async () => {
      const tz = process.env.TZ!;

      this.logger.info('Bot is ready to run');
      this.logger.info(`Set default timezone to ${tz}..`);

      dayjs.extend(utc);
      dayjs.extend(timezone);
      dayjs.tz.setDefault(tz);

      this.logger.info(`Now: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
      this.logger.info(`Bot is now online!`);
    });
  }
}

import cron from 'node-cron';
import { Inject, Service } from 'typedi';
import winston from 'winston';

import { LOGGER } from '../constant.js';
import Event from '../event.js';

@Service()
export default class extends Event {
  public constructor(@Inject(LOGGER) public readonly logger: winston.Logger) {
    super('keepAlive');
  }

  public override listen(): void | Promise<void> {
    cron.schedule(`*/10 * * * *`, () => {
      this.logger.info("Don't sleep...");
    });
  }
}

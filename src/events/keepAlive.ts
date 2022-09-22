import cron from 'node-cron';

import Event from '../event';

export default class extends Event {
  public constructor() {
    super('keepAlive');
  }

  public listen(): void | Promise<void> {
    cron.schedule(`*/10 * * * *`, () => {
      console.log("Don't sleep...");
    });
  }
}

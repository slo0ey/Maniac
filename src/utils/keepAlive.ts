import cron from 'node-cron';

export default (period: number) => {
  cron.schedule(`*/${period} * * * *`, () => {
    console.log("Don't sleep...");
  });
};

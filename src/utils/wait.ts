import promises from 'node:timers/promises';

export default {
  async of(ms: number) {
    return promises.setTimeout(ms);
  },
  async ofSecond(s: number) {
    return promises.setTimeout(s * 1000);
  },
  async ofMinute(m: number) {
    return promises.setTimeout(m * 60000);
  },
  async ofHour(h: number) {
    return promises.setTimeout(h * 3600000);
  },
};

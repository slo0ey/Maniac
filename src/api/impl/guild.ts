import { Data } from 'dataclass';

import IManiacGuild from '../entity/guild.js';

export default class ManiacGuild extends Data implements IManiacGuild {
  id: string = '0';
  game_channels: string[] = [];
}

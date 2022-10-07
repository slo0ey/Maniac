import { Data } from 'dataclass';

import IManiacGuild from '../entity/guild.js';

export default class ManiacGuild extends Data implements IManiacGuild {
  id = '0';
  game_channels = [];
}

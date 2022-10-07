import { Data } from 'dataclass';

import IManiacUser from '../entity/user.js';

import { WordleStatistics } from './user$statistics$wordle.js';

export default class ManiacUser extends Data implements IManiacUser {
  id = '0';
  exp = 0;
  level = 0;
  alternativeName = 'User#1234'; // 다른서버에서 보여질 이름
  statistics = {
    wordle: WordleStatistics.create(),
  };

  updatedExp(this: ManiacUser, exp: number) {
    let newExp = this.exp + exp;
    let newLevel = this.level;
    let max;
    while (newExp >= (max = 100 + newLevel * 10)) {
      newExp -= max;
      newLevel++;
    }
    return { newExp, newLevel };
  }
}

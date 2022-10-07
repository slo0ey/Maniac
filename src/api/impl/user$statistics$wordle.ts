import { Data } from 'dataclass';

import { WordType } from '../../types/wordle.types';
import { IWordleRecord, IWordleStatistics } from '../entity/user$statistics$wordle';

export class WordleRecord extends Data implements IWordleRecord {
  total = 0;
  win = 0;
  lose = 0;
  streak = 0;
  max_streak = 0;

  calcScore(this: WordleRecord, life: number) {
    return life * 10 + (this.streak - 1) * 2;
  }

  updated(this: WordleRecord, win: boolean) {
    const newStreak = win ? this.streak + 1 : 0;
    return this.copy({
      total: this.total + 1,
      win: this.win + (win ? 1 : 0),
      lose: this.lose + (win ? 0 : 1),
      streak: newStreak,
      max_streak: Math.max(newStreak, this.max_streak),
    });
  }
}

export class WordleStatistics extends Data implements IWordleStatistics {
  total = 0;
  win = 0;
  lose = 0;
  detailed_record = {
    '4': WordleRecord.create(),
    '5': WordleRecord.create(),
    '6': WordleRecord.create(),
    '7': WordleRecord.create(),
    '8': WordleRecord.create(),
  };

  calcScore(this: WordleStatistics, type: WordType, life: number) {
    return this.detailed_record[type].calcScore(life);
  }

  updated(this: WordleStatistics, type: WordType, win: boolean) {
    return this.copy({
      total: this.total + 1,
      win: this.win + (win ? 1 : 0),
      lose: this.lose + (win ? 0 : 1),
      detailed_record: {
        [type]: this.detailed_record[type].updated(win),
        ...this.detailed_record,
      },
    });
  }
}

import Entity from '../entity.js';

import { IWordleStatistics } from './user$statistics$wordle.js';

export default interface IManiacUser extends Entity {
  //id
  exp: number;
  level: number;
  alternativeName: string;
  statistics: {
    wordle: IWordleStatistics;
  };
}

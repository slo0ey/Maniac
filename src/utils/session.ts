import { Container } from 'typedi';

import { WORDLE_SESSION } from '../constant.js';
import { Session as WordleSession } from '../types/wordle.types.js';

import GuildMap from './guild_map.js';

export default () => {
  const wordleSession = new GuildMap<string, WordleSession>();
  Container.set(WORDLE_SESSION, wordleSession);
};

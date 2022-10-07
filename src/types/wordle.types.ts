import type GuildMap from '../utils/guild_map.js';

export type Session = {
  channelId: string;
  messageId: string;
  userName: string;
  type: WordType;
  answer: string;
  inputs: Wordle;
  life: number;
};

export type WordleSession = GuildMap<string, Session>;

export type Char = { char: string; type: string };
export type Word = Char[];
export type Wordle = Word[];

export type WordType = '4' | '5' | '6' | '7' | '8';

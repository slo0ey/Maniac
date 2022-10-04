import type GuildMap from '../utils/guild_map.js';

export type Session = {
  channelId: string;
  messageId: string;
  userName: string;
  answer: string;
  inputs: Wordle;
  life: number;
};

export type WordleSession = GuildMap<string, Session>;

export type Char = { char: string; type: string };
export type Word = Char[];
export type Wordle = Word[];

import LRUCache from 'lru-cache';

import createCache from '../utils/cache.js';
import { CachedValue } from '../utils/decorators/cached.js';
import { re } from '../utils/random.js';

type WordRecord = Record<string, number[]>;
type WordsJSON = { words: string[] };
type WordsGroupJSON = { len: WordRecord; start: WordRecord };

const words = (await import('../assets/words.json', { assert: { type: 'json' } }))
  .default as WordsJSON;
const group = (await import('../assets/words_group.json', { assert: { type: 'json' } }))
  .default as WordsGroupJSON;

export default class WordDatabase {
  private static readonly CACHE: LRUCache<string, string[]> = createCache(
    50,
    1000 * 60 * 60 * 12, //12 hours
  );

  private static readonly wordList: string[] = words.words;
  private static readonly groupByLength: WordRecord = group.len;
  private static readonly groupByStart: WordRecord = group.start;

  @CachedValue.Read(WordDatabase.CACHE)
  async getWordsByLength(len: string) {
    return WordDatabase.groupByLength[len].map((v) => WordDatabase.wordList[v]);
  }

  @CachedValue.Read(WordDatabase.CACHE)
  async getWordsByStartChar(sc: string) {
    return WordDatabase.groupByStart[sc].map((v) => WordDatabase.wordList[v]);
  }

  async getRandomWordByLength(len: string) {
    const wbl = await this.getWordsByLength(len);
    return re(...wbl);
  }

  async getRandomWordByStartChar(sc: string) {
    const wbsc = await this.getWordsByStartChar(sc);
    return re(...wbsc);
  }
}

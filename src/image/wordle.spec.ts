import fs from 'fs/promises';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe, it } from 'mocha';

import { createMocks } from '../utils/mock';
import { rs, re } from '../utils/random';

import { createChar, createWord, createWordle, SAME, CONTAIN, NOT_CONTAIN } from './wordle';

chai.use(chaiAsPromised);

describe('Wordle 이미지 테스트', function () {
  const mockData = createMocks(3, (i) =>
    createMocks(5, (i) => ({ char: rs(1).toUpperCase(), type: re(SAME, CONTAIN, NOT_CONTAIN) })),
  );

  it('Char 이미지 생성', async function () {
    const char = createChar(mockData[0][0]);
    const buffer = await char.encode('png');
    await fs.writeFile('./src/assets/w_char_test.png', buffer);
  });

  it('Word 이미지 생성', async function () {
    const char = createWord(mockData[0]);
    const buffer = await char.encode('png');
    await fs.writeFile('./src/assets/w_word_test.png', buffer);
  });

  it('Wordle 이미지 생성', async function () {
    const char = createWordle(mockData);
    const buffer = await char.encode('png');
    await fs.writeFile('./src/assets/w_wordle_test.png', buffer);
  });
});

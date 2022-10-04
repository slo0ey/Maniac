import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { describe, it } from 'mocha';

chai.use(chaiAsPromised);

import WordDatabase from './word';

describe('WordDB 테스트', function () {
  const wordDB = new WordDatabase();

  it('길이 5인 단어목록 가져오기', async function () {
    const list = await wordDB.getWordsByLength('5');
    const front = list.slice(0, 10); //10개만 표시
    console.log(`${front.join(', ')}, ...`);
  });

  it('길이 5인 단어목록 가져오기(From cached)', async function () {
    const list = await wordDB.getWordsByLength('5');
    const front = list.slice(0, 10); //10개만 표시
    console.log(`${front.join(', ')}, ...`);
  });

  it('b로 시작하는 단어목록 가져오기', async function () {
    const list = await wordDB.getWordsByStartChar('b');
    const front = list.slice(100, 110); //10개만 표시
    console.log(`${front.join(', ')}, ...`);
  });

  it('b로 시작하는 단어목록 가져오기(From cached)', async function () {
    const list = await wordDB.getWordsByStartChar('b');
    const front = list.slice(100, 110); //10개만 표시
    console.log(`${front.join(', ')}, ...`);
  });

  it('길이 5인 단어 아무거나 하나 가져오기', async function () {
    const word = await wordDB.getRandomWordsByLength('5');
    console.log(`Random Word: ${word}`);
  });

  it('b로 시작하는 단어 아무거나 하나 가져오기', async function () {
    const word = await wordDB.getRandomWordsByStartChar('b');
    console.log(`Random Word: ${word}`);
  });
});

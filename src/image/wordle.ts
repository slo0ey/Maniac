import { createCanvas } from '@napi-rs/canvas';

import { Char, Word, Wordle } from '../types/wordle.types.js';

export const NOT_CONTAIN = '#A1B0C6';
export const CONTAIN = '#FDCB58';
export const SAME = '#57ac57';

const createChar = ({ char, type }: Char) => {
  const canvas = createCanvas(48, 48);
  const ctx = canvas.getContext('2d');

  ctx.font = '24px sans-serif';

  ctx.fillStyle = type;
  ctx.fillRect(1, 1, 46, 46);

  const absoluteWidth = ctx.measureText(char).width;
  ctx.fillStyle = '#ffffff';
  ctx.fillText(char, (48 - absoluteWidth) / 2, 34); //좌우 균형 맞추기

  return canvas;
};

const createWord = (word: Word) => {
  const width = word.length;
  const canvas = createCanvas(48 * width, 48);
  const ctx = canvas.getContext('2d');

  let xPos = 0;
  for (const char of word) {
    const cImage = createChar(char);

    ctx.drawImage(cImage, xPos, 0);
    xPos += 48;
  }

  return canvas;
};

const createWordle = (wordle: Wordle) => {
  const width = wordle[0].length;
  const height = wordle.length;
  const canvas = createCanvas(48 * width, 48 * height);
  const ctx = canvas.getContext('2d');

  let yPos = 0;
  for (const word of wordle) {
    const wImage = createWord(word);

    ctx.drawImage(wImage, 0, yPos);
    yPos += 48;
  }

  return canvas;
};

export { createChar, createWord, createWordle };

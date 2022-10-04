const fs = require('fs/promises');
const data = require('./words_dictionary.json');

(async () => {
  const words = Object.keys(data);
  const group = { len: {}, start: {} };
  for (let index = 0; index < words.length; index++) {
    let word = words[index];
    let len = word.length;
    let start = word[0];

    if (!group.len[len]) {
      group.len[len] = [];
    }
    group.len[len].push(index);

    if (!group.start[start]) {
      group.start[start] = [];
    }
    group.start[start].push(index);
  }

  try {
    await fs.writeFile('./src/assets/words.json', JSON.stringify({ words }), 'utf-8');
    await fs.writeFile('./src/assets/words_group.json', JSON.stringify(group), 'utf-8');
  } catch (e) {
    console.error(e);
  }
})();

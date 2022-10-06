import { MessageCollector } from 'discord.js';
import { Container } from 'typedi';

import { WORDLE_SESSION } from '../constant.js';
import { CONTAIN, createWord, createWordle, NOT_CONTAIN, SAME } from '../image/wordle.js';
import { MessageTemplate } from '../interactions/wordle.js';
import { WordleSession } from '../types/wordle.types.js';

const sessionContainer = Container.get(WORDLE_SESSION) as WordleSession;

const answerCollector = (collector: MessageCollector) => {
  collector.on('collect', async (message) => {
    const sessionKey = JSON.stringify({ channelId: message.channelId, userId: message.author.id });
    const session = sessionContainer.get(message.guildId!, sessionKey);

    if (!session) {
      collector.stop();
      return;
    }
    await message.delete(); //쓴 단어 삭제

    const { messageId, answer, userName } = session;
    const input = [];
    const mMessage =
      message.channel.messages.cache.get(messageId) ??
      (await message.channel.messages.fetch(messageId));

    if (message.content === answer) {
      const mCanvas = createWord(Array.from(answer).map((char) => ({ char, type: SAME })));
      const mImage = await mCanvas.encode('png');
      await mMessage.edit({
        content: ':tada 축하합니다! 정답입니다! :tada:',
        files: [mImage],
      });
      await mMessage.delete();

      collector.stop();
      return;
    }

    // wordle 이미지 생성
    for (let i = 0; i < answer.length; i++) {
      const char = message.content[i];
      if (char === answer[i]) {
        input.push({ char, type: SAME });
      } else if (answer.indexOf(char) != -1) {
        input.push({ char, type: CONTAIN });
      } else {
        input.push({ char, type: NOT_CONTAIN });
      }
    }
    const mCanvas = createWordle(session.inputs);
    const mImage = await mCanvas.encode('png');

    // 세션 업데이트
    session.inputs.push(input);
    session.life--;

    await mMessage.edit({
      content: MessageTemplate.onGame(userName, session.life),
      files: [mImage],
    });
  });
};

export { answerCollector };

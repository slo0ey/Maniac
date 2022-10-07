import { MessageCollector } from 'discord.js';
import { Container } from 'typedi';

import ManiacUser from '../api/impl/user.js';
import { WORDLE_SESSION } from '../constant.js';
import UserDatabase from '../db/user.js';
import { CONTAIN, createWord, createWordle, NOT_CONTAIN, SAME } from '../image/wordle.js';
import { EmbedTemplate, MessageTemplate } from '../interactions/wordle.js';
import { WordleSession, WordType } from '../types/wordle.types.js';

const calcScore = (type: WordType, life: number, streak: number) => {
  let score = life * 10;
  switch (type) {
    case '4':
      score *= 0.75;
      break;
    case '6':
      score *= 1.25;
      break;
    case '7':
      score *= 1.5;
      break;
    case '8':
      score *= 1.75;
      break;
  }
  return score + streak * 2;
};

const answerCollector = (collector: MessageCollector) => {
  const sessionContainer = Container.get(WORDLE_SESSION) as WordleSession;
  const userDB = Container.get(UserDatabase);

  collector.on('collect', async (message) => {
    const sessionKey = JSON.stringify({ channelId: message.channelId, userId: message.author.id });
    const session = sessionContainer.get(message.guildId!, sessionKey);

    if (!session) {
      collector.stop();
      return;
    }
    await message.delete(); //쓴 단어 삭제

    const { messageId, answer, userName } = session;
    const mMessage =
      message.channel.messages.cache.get(messageId) ??
      (await message.channel.messages.fetch(messageId));

    if (message.content === answer) {
      collector.stop('success');
      return;
    }

    // wordle 이미지 생성
    const input = [];
    for (let i = 0; i < answer.length; i++) {
      const char = message.content.charAt(i);
      if (char === answer[i]) {
        input.push({ char, type: SAME });
      } else if (answer.indexOf(char) != -1) {
        input.push({ char, type: CONTAIN });
      } else {
        input.push({ char, type: NOT_CONTAIN });
      }
    }
    session.inputs.push(input);
    session.life--;

    const mCanvas = createWordle(session.inputs);
    const mImage = await mCanvas.encode('png');

    await mMessage.edit({
      content: MessageTemplate.onGame(userName, session.life),
      files: [mImage],
    });
  });

  collector.once('end', async (collected, reason) => {
    console.log(reason);
    if (reason == 'success') {
      // 세션 가져오기
      const message = collected.at(0)!;
      const sessionKey = JSON.stringify({
        channelId: message.channelId,
        userId: message.author.id,
      });
      const { answer, messageId, userName, type, life } = sessionContainer.get(
        message.guildId!,
        sessionKey,
      )!;

      // 통계 가져오기 & 업데이트
      const user = await userDB.get(message.author.id);
      const statistics = user!.statistics.wordle;
      const newStatistics = statistics.updated(type, true);

      const score = newStatistics.calcScore(type, life);
      const newUser = ManiacUser.create({
        statistics: { wordle: newStatistics },
        ...user!.updatedExp(score * 0.1),
      });

      await userDB.update(newUser);

      // 정답 이미지 생성
      const mCanvas = createWord(Array.from(answer).map((char) => ({ char, type: SAME })));
      const mImage = await mCanvas.encode('png');

      // 기존 메시지 삭제
      const mMessage =
        message.channel.messages.cache.get(messageId) ??
        (await message.channel.messages.fetch(messageId));
      await mMessage.delete();

      await message.channel.send({
        content: '',
        embeds: [EmbedTemplate.onSuccess(userName, type, score, statistics)],
        files: [mImage],
      });

      sessionContainer.delete(message.guildId!, sessionKey);
    } else if(reason == 'limit') {
      //TODO: 6회 초과시 코드 작성
    }
  });
};

export { answerCollector };

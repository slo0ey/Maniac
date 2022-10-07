import { ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

import { WordleStatistics } from '../api/impl/user$statistics$wordle';
import { WORDLE_IMG_URL } from '../constant.js';
import { WordType } from '../types/wordle.types';

const WordleCommand = Object.assign(
  new SlashCommandBuilder()
    .setName('wordle')
    .setDescription('Wordle 플레이하기')
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName('option')
        .setDescription('단어 길이 혹은 guide 혹은 end')
        .addChoices(
          { name: '4', value: '4' },
          { name: '5', value: '5' },
          { name: '6', value: '6' },
          { name: '7', value: '7' },
          { name: '8', value: '8' },
          { name: 'guide', value: 'guide' },
          { name: 'end', value: 'end' },
        ),
    )
    .toJSON(),
  { allowedGuilds: [] },
);

const typeVars = {
  '4': { e: ':four:', m: '0.75' },
  '5': { e: ':five:', m: '1.00' },
  '6': { e: ':six:', m: '1.25' },
  '7': { e: ':seven:', m: '1.50' },
  '8': { e: ':eight:', m: '1.75' },
};

const MessageTemplate = {
  onGame(playerName: string, life: number) {
    return `:regional_indicator_w: :regional_indicator_o: :regional_indicator_r: :regional_indicator_d: :regional_indicator_l: :regional_indicator_e:
    > :bust_in_silhouette: 플레이어: ${playerName}
    > :hearts: 남은 기회: ${':heart:'.repeat(life) + ':black_heart:'.repeat(6 - life)}`;
  },
};

const EmbedTemplate = {
  onSuccess(playerName: string, type: WordType, score: number, statistics: WordleStatistics) {
    const { total, win, streak } = statistics.detailed_record[type];
    const { e, m } = typeVars[type];
    const winRate = ((win / total) * 100).toFixed(2);
    const winRateGap = (win / total - ((win - 1) / total) * 100).toFixed(2);
    return new EmbedBuilder()
      .setTitle(':tada: 축하합니다! 정답입니다! :tada:')
      .setDescription(
        `정답자: **${playerName}**\n점수: **+${score}**\n승률: **${winRate}% (${winRateGap}%)**`,
      )
      .setThumbnail(WORDLE_IMG_URL)
      .addFields(
        { name: `${e + ' Word Bonus ' + e}`, value: `Length: ${type}: x${m}` },
        {
          name: ':bar_chart: Streak Bonus :bar_chart:',
          value: `${streak - 1} streak: +${(streak - 1) * 2}`,
        },
      )
      .setColor(0x57ac57);
  },
  onGuide(avatarURL: string) {
    return new EmbedBuilder()
      .setTitle('How to play wordle??')
      .setDescription(
        'Click [here](https://namu.wiki/w/Wordle#s-3.1) to check the guide.\nAlso Tips [here](https://namu.wiki/w/Wordle#s-3.2)!',
      )
      .setThumbnail(WORDLE_IMG_URL)
      .setColor(0x57ac57);
  },
  onRemained(avatarURL: string) {
    return new EmbedBuilder()
      .setTitle('이미 진행중인 게임이 있습니다!')
      .setDescription('새 게임을 진행하려면 `/wordle end` 명령어 또는\n아래 버튼을 눌러주세요.')
      .setThumbnail(WORDLE_IMG_URL)
      .setColor(0x57ac57);
  },
  onReset(avatarURL: string) {
    return new EmbedBuilder()
      .setTitle('진행중인 게임을 초기화했습니다.')
      .setDescription(
        '새 게임을 시작하려면 \n`/wordle` 또는 `/wordle <length>`\n명령어를 이용해주세요.',
      )
      .setThumbnail(WORDLE_IMG_URL)
      .setColor(0x57ac57);
  },
};

const ButtonTemplate = {
  onReset(userId: string) {
    return new ButtonBuilder()
      .setCustomId(`wordle|reset|${userId}`)
      .setLabel('Reset!')
      .setStyle(ButtonStyle.Danger);
  },
};

export { WordleCommand, MessageTemplate, EmbedTemplate, ButtonTemplate };

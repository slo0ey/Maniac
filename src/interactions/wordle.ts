import { ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

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

const MessageTemplate = {
  onGame(playerName: string, life: number) {
    return `:regional_indicator_w: :regional_indicator_o: :regional_indicator_r: :regional_indicator_d: :regional_indicator_l: :regional_indicator_e:
    > :bust_in_silhouette: 플레이어: ${playerName}
    > :hearts: 남은 기회: ${':heart:'.repeat(life) + ':black_heart:'.repeat(6 - life)}`;
  },
};

const EmbedTemplate = {
  guide(avatarURL: string) {
    return new EmbedBuilder()
      .setTitle('How to play wordle??')
      .setDescription(
        'Click [here](https://namu.wiki/w/Wordle#s-3.1) to check the guide.\nAlso Tips [here](https://namu.wiki/w/Wordle#s-3.2)!',
      )
      .setThumbnail('https://assets.stickpng.com/images/6228c92e9da9446176b9f710.png')
      .setColor(0x57ac57)
      .setFooter({ text: 'Wordle', iconURL: avatarURL });
  },
  remained(avatarURL: string) {
    return new EmbedBuilder()
      .setTitle('이미 진행중인 게임이 있습니다!')
      .setDescription('새 게임을 진행하려면 `/wordle end` 명령어 또는\n아래 버튼을 눌러주세요.')
      .setThumbnail('https://assets.stickpng.com/images/6228c92e9da9446176b9f710.png')
      .setColor(0x57ac57)
      .setFooter({ text: 'Wordle', iconURL: avatarURL });
  },
  clear(avatarURL: string) {
    return new EmbedBuilder()
      .setTitle('진행중인 게임을 초기화했습니다.')
      .setDescription(
        '새 게임을 시작하려면 \n`/wordle` 또는 `/wordle <length>`\n명령어를 이용해주세요.',
      )
      .setThumbnail('https://assets.stickpng.com/images/6228c92e9da9446176b9f710.png')
      .setColor(0x57ac57)
      .setFooter({ text: 'Wordle', iconURL: avatarURL });
  },
};

const ButtonTemplate = {
  clear(userId: string) {
    return new ButtonBuilder()
      .setCustomId(`wordle|reset|${userId}`)
      .setLabel('Reset!')
      .setStyle(ButtonStyle.Danger);
  },
};

export { WordleCommand, MessageTemplate, EmbedTemplate, ButtonTemplate };

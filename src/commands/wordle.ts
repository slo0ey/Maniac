import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Client,
  GuildMember,
  Message,
  TextChannel,
} from 'discord.js';
import { Container, Inject, Service } from 'typedi';
import winston from 'winston';

import { answerCollector } from '../collectors/wordle.js';
import { Command } from '../command.js';
import { DISCORD_CLIENT, LOGGER, WORDLE_SESSION } from '../constant.js';
import UserDatabase from '../db/user.js';
import WordDatabase from '../db/word.js';
import { createWord, NOT_CONTAIN } from '../image/wordle.js';
import { EmbedTemplate as CommonEmbedTemplate } from '../interactions/common.js';
import { MessageTemplate, EmbedTemplate, ButtonTemplate } from '../interactions/wordle.js';
import type { Session, WordleSession, WordType } from '../types/wordle.types.js';

type WordleCommandArgument = {
  option?: WordType | 'guide' | 'end';
};

@Service()
export default class WordleCommand extends Command<WordleCommandArgument> {
  private readonly userDB: UserDatabase;
  private readonly wordDB: WordDatabase;

  public constructor(
    @Inject(DISCORD_CLIENT) private readonly client: Client<true>,
    @Inject(LOGGER) private readonly logger: winston.Logger,
    @Inject(WORDLE_SESSION) private readonly sessionContainer: WordleSession,
  ) {
    super('wordle');
    this.userDB = Container.get(UserDatabase);
    this.wordDB = new WordDatabase();
  }

  public override async chatInput(
    ctx: ChatInputCommandInteraction,
    args: WordleCommandArgument,
  ): Promise<void> {
    const guild = ctx.guild!;
    const channel = ctx.channel! as TextChannel;
    const member = ctx.member! as GuildMember;
    const option = args.option ?? '5';

    const user = await this.userDB.get(member.id);
    if (!user) {
      await ctx.reply({ embeds: [CommonEmbedTemplate.unregistered()] });
      return;
    }

    const sessionKey = JSON.stringify({ channelId: channel.id, userId: member.id });

    if (Number.isInteger(+option)) {
      await ctx.deferReply();

      if (this.sessionContainer.has(guild.id, sessionKey)) {
        // 이미 진행중인 게임이 있으면
        const { messageId } = this.sessionContainer.get(guild.id, sessionKey)!;
        const embed = EmbedTemplate.onRemained(this.client.user.displayAvatarURL());
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          ButtonTemplate.onReset(messageId),
        );
        await ctx.editReply({ embeds: [embed], components: [row] });
      } else {
        // 새 게임 생성
        const member = ctx.member! as GuildMember;
        const answer = await this.wordDB.getRandomWordByLength(option);
        const canvas = createWord(new Array(+option).fill({ char: '', type: NOT_CONTAIN }));
        const image = await canvas.encode('png');

        const message = await ctx.editReply({
          content: MessageTemplate.onGame(member.displayName, 6),
          files: [image],
        });

        // 세션 등록
        const session: Session = {
          channelId: channel.id,
          messageId: message.id,
          userName: member.displayName,
          type: option as WordType,
          answer,
          inputs: [],
          life: 6,
        };
        this.sessionContainer.set(guild.id, sessionKey, session);

        const isEnglish = /^[A-Za-z]*$/;
        const filter = (m: Message) =>
          isEnglish.test(m.content) && m.author.id == member.id && m.channelId == channel.id;
        // 메시지 컬렉터 생성
        answerCollector(
          channel.createMessageCollector({
            filter,
            max: 6,
            time: 60000 * 10,
          }),
        );

        this.logger.debug(answer);
      }
    } else if (option === 'guide') {
      // 가이드 보여주기
      await ctx.reply({
        ephemeral: true,
        embeds: [EmbedTemplate.onGuide(this.client.user.displayAvatarURL())],
      });
    } else {
      await ctx.reply({ ephemeral: true, content: ':x: 아직 안만듬' });
    }
  }

  public override async buttonClick(
    ctx: ButtonInteraction<CacheType>,
    customId: string,
  ): Promise<void> {
    if (customId.startsWith('reset')) {
      const sessionkey = JSON.stringify({ channelId: ctx.channel!.id, userId: ctx.user.id });
      this.sessionContainer.delete(ctx.guildId!, sessionkey);
      await ctx.message.delete();

      const embed = EmbedTemplate.onReset(this.client.user.displayAvatarURL());
      await ctx.reply({ embeds: [embed] });
    }
  }
}

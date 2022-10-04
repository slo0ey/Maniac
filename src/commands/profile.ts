import { ChatInputCommandInteraction } from 'discord.js';
import { Container, Inject, Service } from 'typedi';
import winston from 'winston';

import ManiacUser from '../api/impl/user.js';
import { Command } from '../command.js';
import { LOGGER } from '../constant.js';
import UserDatabase from '../db/user.js';
import { MemberOrUserOrEmpty } from '../types/common.types.js';
import wait from '../utils/wait.js';

type ProfileCommandArgument = {
  user?: MemberOrUserOrEmpty;
};

@Service()
export default class ProfileCommand extends Command<ProfileCommandArgument> {
  private readonly userDB: UserDatabase;

  public constructor(@Inject(LOGGER) private readonly logger: winston.Logger) {
    super('profile');
    this.userDB = Container.get(UserDatabase);
  }

  public override async chatInput(
    ctx: ChatInputCommandInteraction,
    args: ProfileCommandArgument,
  ): Promise<void> {
    await ctx.deferReply({ ephemeral: true });
    const userId = args.user?.id ?? ctx.user.id;
    const user = await this.userDB.get(userId);

    if (user !== null) {
      const { id, alternativeName } = user;
      await ctx.editReply(`아이디: ${id} 숨길 이름: ${alternativeName}`);
    } else {
      if (userId !== ctx.user.id) {
        await ctx.editReply('프로필을 찾을 수 없습니다.');
      } else {
        await ctx.followUp({ ephemeral: true, content: '프로필을 생성중입니다...' });

        const user = ManiacUser.create({
          id: userId,
          alternativeName: `User#${userId.substring(0, 4)}`,
        });
        await this.userDB.insert(user);

        await wait.of(1000);
        await ctx.editReply({
          content: `아이디: ${user.id} 숨길 이름: ${user.alternativeName}`,
        });
      }
    }
  }
}

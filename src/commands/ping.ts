import { Service } from 'typedi';

import { Command, ChatInputContext, NoArguments } from '../command.js';

@Service()
class PingCommand extends Command<NoArguments> {
  public constructor() {
    super('ping');
  }

  public override async chatInput(
    ctx: ChatInputContext,
    args: NoArguments,
  ): Promise<void> {
    super.chatInput(ctx, args);
    await ctx.deferReply({ ephemeral: true });
    await ctx.editReply('Pong! 🏓');
  }
}

export default PingCommand;

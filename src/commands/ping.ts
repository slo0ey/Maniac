import { Service } from 'typedi';
import { Command, ChatInputContext } from '../command.js';

@Service()
class PingCommand extends Command<{}> {
  public constructor() {
    super('ping');
  }

  public override async chatInput(ctx: ChatInputContext, args: {}): Promise<void> {
    super.chatInput(ctx, args);
    await ctx.deferReply({ ephemeral: true });
    await ctx.editReply('Pong! 🏓');
  }
}

export default PingCommand;

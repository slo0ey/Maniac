import { ChatInputCommandInteraction } from 'discord.js';
import { Service } from 'typedi';

import { Command, NoArguments } from '../command.js';

@Service()
export default class PingCommand extends Command<NoArguments> {
  public constructor() {
    super('ping');
  }

  public override async chatInput(
    ctx: ChatInputCommandInteraction,
    args: NoArguments,
  ): Promise<void> {
    await ctx.deferReply({ ephemeral: true });
    await ctx.editReply('Pong! 🏓');
  }
}

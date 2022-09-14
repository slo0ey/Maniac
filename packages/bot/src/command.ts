import type { AutocompleteInteraction, ChatInputCommandInteraction } from 'discord.js';

export type Arguments = { [k: string]: unknown };

export type ChatInputContext = ChatInputCommandInteraction;

export abstract class Command<T extends Arguments> {
  public constructor(public readonly name: string) {}

  public chatInput(ctx: ChatInputContext, args: T): Promise<void> | void {}
  public autoComplete(interaction: AutocompleteInteraction): Promise<void> | void {}
}

import type {
  AutocompleteInteraction,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  CommandInteractionOption,
} from 'discord.js';

import { argumentOf } from './utils/argumentOf.js';

export type Arguments = { [k: string]: unknown };

export type NoArguments = Record<string, unknown>;

export abstract class Command<T extends Arguments> {
  public constructor(public readonly name: string) {}

  public async chatInput(ctx: ChatInputCommandInteraction, args: T): Promise<void> {}
  public autoComplete(ctx: AutocompleteInteraction): Promise<void> | void {}
  public buttonClick(ctx: ButtonInteraction, customId: string, ...args: string[]): Promise<void> | void {}
  public translateArguments(data: readonly CommandInteractionOption<CacheType>[]): T {
    return argumentOf(data) as T;
  }
}

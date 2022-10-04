import { ApplicationCommandOptionType, CacheType, CommandInteractionOption } from 'discord.js';

import { Arguments } from '../command.js';
import { MemberOrUserOrEmpty } from '../types/common.types.js';

export function argumentOf<T extends Arguments>(
  args: readonly CommandInteractionOption<CacheType>[],
): T {
  return args.reduce((accumulator, option) => {
    switch (option.type) {
      case ApplicationCommandOptionType.String:
      case ApplicationCommandOptionType.Number:
      case ApplicationCommandOptionType.Boolean:
      case ApplicationCommandOptionType.Integer:
        return { ...accumulator, [option.name]: option.value };
      case ApplicationCommandOptionType.User:
        return {
          ...accumulator,
          [option.name]: (option.member ?? option.user) as MemberOrUserOrEmpty,
        };
      case ApplicationCommandOptionType.Channel:
        return { ...accumulator, [option.name]: option.channel };
      case ApplicationCommandOptionType.Role:
        return { ...accumulator, [option.name]: option.role };
      case ApplicationCommandOptionType.Attachment:
        return { ...accumulator, [option.name]: option.attachment };
      default:
        return { ...accumulator }; //umm...
    }
  }, {}) as T;
}

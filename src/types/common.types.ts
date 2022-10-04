import { APIInteractionDataResolvedGuildMember, GuildMember, User } from 'discord.js';

export type MemberOrUserOrEmpty = GuildMember | User | null | undefined;

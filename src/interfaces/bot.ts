import { BotWithCache, Interaction, Message } from "../../deps.ts";
import { AmethystEventHandler } from "../classes/AmethystEvents.ts";
import Category from "../classes/Category.ts";
import { Command } from "../classes/Command.ts";
import { CategoryOptions } from "../types/categoryOptions.ts";
import { CommandOptions } from "../types/commandOptions.ts";
import { AmethystCollection } from "../utils/AmethystCollection.ts";
import { Async } from "../utils/types.ts";
import {
  AmethystReaction,
  ComponentCollector,
  ComponentCollectorOptions,
  MessageCollector,
  MessageCollectorOptions,
  ReactionCollector,
  ReactionCollectorOptions,
} from "./collectors.ts";
import { CommandCooldown } from "./command.ts";
import { AmethystError } from "./errors.ts";
import { AmethystEvents } from "./event.ts";
import { AmethystTask } from "./tasks.ts";

interface runningTasks {
  initialTimeouts: number[];
  intervals: number[];
}

/**An extended version of BotWithCache with a command handler and extra utils*/
export type AmethystBot<
  B extends Omit<BotWithCache, "events"> = Omit<BotWithCache, "events">
> = B & AmethystProps & { utils: AmethystUtils };

interface AmethystUtils {
  awaitComponent(
    messageId: bigint,
    options?: ComponentCollectorOptions & { maxUsage?: 1 }
  ): Promise<Interaction>;
  awaitComponent(
    messageId: bigint,
    options?: ComponentCollectorOptions & { maxUsage?: number }
  ): Promise<Interaction[]>;
  awaitComponent(
    messageId: bigint,
    options?: ComponentCollectorOptions
  ): Promise<Interaction>;
  awaitReaction(
    messageId: bigint,
    options?: ReactionCollectorOptions & { maxUsage?: 1 }
  ): Promise<AmethystReaction>;
  awaitReaction(
    messageId: bigint,
    options?: ReactionCollectorOptions & { maxUsage?: number }
  ): Promise<AmethystReaction[]>;
  awaitReaction(
    messageId: bigint,
    options?: ReactionCollectorOptions
  ): Promise<AmethystReaction>;
  awaitMessage(
    memberId: bigint,
    channelId: bigint,
    options?: MessageCollectorOptions & { maxUsage?: 1 }
  ): Promise<Message>;
  awaitMessage(
    memberId: bigint,
    channelId: bigint,
    options?: MessageCollectorOptions & { maxUsage?: number }
  ): Promise<Message[]>;
  awaitMessage(
    memberId: bigint,
    channelId: bigint,
    options?: MessageCollectorOptions
  ): Promise<Message>;
  createCommand(command: CommandOptions): void;
  createCategory(category: CategoryOptions): void;
  updateCategory(category: CategoryOptions): void;
  createTask(task: AmethystTask): void;
  clearTasks(): void;
  createInhibitor<T extends Command = Command>(
    name: string,
    inhibitor: (
      bot: AmethystBot,
      command: T,
      options?: { memberId?: bigint; guildId?: bigint; channelId: bigint }
    ) => true | AmethystError
  ): void;
  deleteInhibitor(name: string): void;
}

interface AmethystProps extends Omit<BotWithCache, "events"> {
  events: AmethystEvents;
  messageCollectors: AmethystCollection<string, MessageCollector>;
  componentCollectors: AmethystCollection<bigint, ComponentCollector>;
  reactionCollectors: AmethystCollection<bigint, ReactionCollector>;
  runningTasks: runningTasks;
  tasks: AmethystCollection<string, AmethystTask>;
  category: AmethystCollection<string, Category>;
  inhibitors: AmethystCollection<
    string,
    <T extends Command = Command>(
      bot: AmethystBot,
      command: T,
      options: { memberId?: bigint; channelId: bigint; guildId?: bigint }
    ) => true | AmethystError
  >;
  owners?: bigint[];
  botMentionAsPrefix?: boolean;
  prefixCaseSensitive?: boolean;
  defaultCooldown?: CommandCooldown;
  ignoreCooldown?: bigint[];
  guildOnly?: boolean;
  messageQuotedArguments?: boolean;
  ignoreBots?: boolean;
  dmOnly?: boolean;
  eventHandler: AmethystEventHandler;
  extras: any;
  prefix?:
    | string
    | string[]
    | ((bot: AmethystBot, message: Message) => Async<string | string[]>);

  on(
    name: string,
    callback: <T extends keyof AmethystEvents>(
      ...args: [...Parameters<AmethystEvents[T]>]
    ) => Promise<void>
  ): void;
  once(
    name: string,
    callback: <T extends keyof AmethystEvents>(
      ...args: [...Parameters<AmethystEvents[T]>]
    ) => Promise<void>
  ): void;
}

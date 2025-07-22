import {
  SlashCommandBuilder,
  CommandInteraction,
  GatewayIntentBits,
  ClientEvents
} from 'discord.js'

/**
 * Configuration options for the command handler
 */
export interface CommandHandlerOptions {
  /** Bot token for authentication */
  token?: string
  /** Client ID for deploying slash commands */
  clientId?: string
  /** Discord gateway intents */
  intents?: GatewayIntentBits[]
  /** Whether to automatically deploy commands on start */
  autoDeploy?: boolean
  /** Guild ID for guild-specific commands (optional) */
  guildId?: string
}

/**
 * Represents a slash command
 */
export interface Command {
  /** Command data using SlashCommandBuilder */
  data: SlashCommandBuilder
  /** Function to execute when command is called */
  execute: (interaction: CommandInteraction) => Promise<void> | void
  /** Command category for organization */
  category?: string
  /** Whether command is disabled */
  disabled?: boolean
  /** Cooldown in seconds */
  cooldown?: number
}

/**
 * Represents an event handler
 */
export interface Event {
  /** Event name from Discord.js ClientEvents */
  name: keyof ClientEvents
  /** Whether this is a once event */
  once?: boolean
  /** Function to execute when event is triggered */
  execute: (...args: any[]) => Promise<void> | void
}

/**
 * Command handler interface
 */
export interface CommandHandler {
  registerCommand(command: Command): this
  registerEvent(event: Event): this
  loadCommands(path: string): Promise<this>
  loadEvents(path: string): Promise<this>
  deployCommands(guildId?: string): Promise<void>
  start(): Promise<void>
}

/**
 * Event handler interface
 */
export interface EventHandler {
  name: keyof ClientEvents
  once?: boolean
  execute: (...args: any[]) => Promise<void> | void
}

/**
 * Command execution context
 */
export interface CommandContext {
  interaction: CommandInteraction
  args: any[]
  handler: CommandHandler
}

/**
 * Command metadata for decorators
 */
export interface CommandMetadata {
  name: string
  description: string
  category?: string
  cooldown?: number
  disabled?: boolean
}

/**
 * Event metadata for decorators
 */
export interface EventMetadata {
  name: keyof ClientEvents
  once?: boolean
}

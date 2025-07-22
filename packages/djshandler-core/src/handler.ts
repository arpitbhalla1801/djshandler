import {
  Client,
  Collection,
  GatewayIntentBits,
  SlashCommandBuilder,
  CommandInteraction,
  Events,
  REST,
  Routes
} from 'discord.js'

import type {
  Command,
  CommandHandler,
  CommandHandlerOptions,
  Event,
  EventHandler
} from './types'

/**
 * The main command handler class that manages Discord.js bot commands and events
 */
export class DJSHandler {
  private client: Client
  private commands: Collection<string, Command> = new Collection()
  private events: Collection<string, Event> = new Collection()
  private rest?: REST

  constructor(private options: CommandHandlerOptions) {
    this.client = new Client({
      intents: this.options.intents || [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    if (this.options.token) {
      this.rest = new REST().setToken(this.options.token)
    }

    this.setupDefaultEvents()
  }

  /**
   * Register a command with the handler
   */
  public registerCommand(command: Command): this {
    this.commands.set(command.data.name, command)
    return this
  }

  /**
   * Register an event with the handler
   */
  public registerEvent(event: Event): this {
    this.events.set(event.name, event)
    
    if (event.once) {
      this.client.once(event.name as any, (...args) => event.execute(...args))
    } else {
      this.client.on(event.name as any, (...args) => event.execute(...args))
    }
    
    return this
  }

  /**
   * Load all commands from a directory
   */
  public async loadCommands(commandsPath: string): Promise<this> {
    // Implementation for loading commands from filesystem
    // This would use dynamic imports to load command files
    return this
  }

  /**
   * Load all events from a directory
   */
  public async loadEvents(eventsPath: string): Promise<this> {
    // Implementation for loading events from filesystem
    return this
  }

  /**
   * Deploy slash commands to Discord
   */
  public async deployCommands(guildId?: string): Promise<void> {
    if (!this.rest || !this.options.clientId) {
      throw new Error('REST client not initialized or clientId not provided')
    }

    const commandsData = Array.from(this.commands.values()).map(command => 
      command.data.toJSON()
    )

    try {
      console.log(`Started refreshing ${commandsData.length} application (/) commands.`)

      const route = guildId 
        ? Routes.applicationGuildCommands(this.options.clientId, guildId)
        : Routes.applicationCommands(this.options.clientId)

      await this.rest.put(route, { body: commandsData })

      console.log(`Successfully reloaded ${commandsData.length} application (/) commands.`)
    } catch (error) {
      console.error('Error deploying commands:', error)
      throw error
    }
  }

  /**
   * Start the bot
   */
  public async start(): Promise<void> {
    if (!this.options.token) {
      throw new Error('Bot token is required to start the client')
    }

    try {
      await this.client.login(this.options.token)
      console.log('Bot started successfully!')
    } catch (error) {
      console.error('Error starting bot:', error)
      throw error
    }
  }

  /**
   * Get the Discord.js client instance
   */
  public getClient(): Client {
    return this.client
  }

  /**
   * Get registered commands
   */
  public getCommands(): Collection<string, Command> {
    return this.commands
  }

  /**
   * Get registered events
   */
  public getEvents(): Collection<string, Event> {
    return this.events
  }

  /**
   * Setup default event handlers
   */
  private setupDefaultEvents(): void {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return

      const command = this.commands.get(interaction.commandName)
      if (!command) return

      try {
        await command.execute(interaction)
      } catch (error) {
        console.error(`Error executing command ${interaction.commandName}:`, error)
        
        const reply = { 
          content: 'There was an error while executing this command!', 
          ephemeral: true 
        }

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply)
        } else {
          await interaction.reply(reply)
        }
      }
    })

    this.client.on(Events.ClientReady, () => {
      console.log(`Ready! Logged in as ${this.client.user?.tag}`)
    })
  }
}

export { DJSHandler as CommandHandler }

# djshandler-core

The core framework for building Discord.js bots with powerful command handling and event management.

## Features

- 🚀 **Express-like Architecture** - Familiar patterns for web developers
- 🎯 **Type-Safe** - Full TypeScript support with excellent IntelliSense
- 🔥 **Hot Reload** - Development mode with automatic reloading
- 🎨 **Decorator Support** - Clean, modern syntax with decorators
- 📁 **File-based Routing** - Organize commands and events by files/folders
- ⚡ **Zero Config** - Works out of the box with sensible defaults

## Installation

```bash
npm install djshandler-core discord.js
```

## Quick Start

```typescript
import { DJSHandler } from 'djshandler-core'
import { GatewayIntentBits } from 'discord.js'

const handler = new DJSHandler({
  token: 'your-bot-token',
  clientId: 'your-client-id',
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

// Load commands and events from directories
await handler.loadCommands('./commands')
await handler.loadEvents('./events')

// Start the bot
await handler.start()
```

## Command Example

```typescript
// commands/ping.ts
import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import type { Command } from 'djshandler-core'

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  
  async execute(interaction: CommandInteraction) {
    await interaction.reply('🏓 Pong!')
  }
}
```

## Event Example

```typescript
// events/ready.ts
import { Events, Client } from 'discord.js'
import type { Event } from 'djshandler-core'

export const event: Event = {
  name: Events.Ready,
  once: true,
  
  async execute(client: Client) {
    console.log(`Bot is ready! Logged in as ${client.user?.tag}`)
  }
}
```

## Using Decorators

```typescript
import { CommandClass, Execute } from 'djshandler-core'
import { CommandInteraction } from 'discord.js'

@CommandClass({
  name: 'hello',
  description: 'Say hello!'
})
export class HelloCommand {
  @Execute()
  async run(interaction: CommandInteraction) {
    await interaction.reply('Hello, World! 👋')
  }
}
```

## API Reference

### DJSHandler

The main class for managing your Discord bot.

#### Constructor Options

```typescript
interface CommandHandlerOptions {
  token?: string
  clientId?: string
  intents?: GatewayIntentBits[]
  autoDeploy?: boolean
  guildId?: string
}
```

#### Methods

- `registerCommand(command: Command)` - Register a single command
- `registerEvent(event: Event)` - Register a single event
- `loadCommands(path: string)` - Load all commands from a directory
- `loadEvents(path: string)` - Load all events from a directory
- `deployCommands(guildId?: string)` - Deploy slash commands to Discord
- `start()` - Start the bot

## License

MIT

# 🔥 djshandler

> **The Express.js of Discord bots** - A powerful command handler framework with CLI scaffolding and smart runtime engine

[![npm version](https://badge.fury.io/js/djshandler-cli.svg)](https://badge.fury.io/js/djshandler-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/discord/YOUR_SERVER_ID.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/YOUR_INVITE)

djshandler is a comprehensive framework for building Discord.js bots with modern developer ergonomics. It combines the simplicity of Express.js with the power of Discord.js, providing a CLI scaffolder, smart runtime engine, and full TypeScript support.

## ✨ Features

- 🚀 **CLI Scaffolding** - Create projects instantly with `djshandler create`
- 🎯 **Type-Safe** - Full TypeScript support with excellent IntelliSense  
- 🔥 **Hot Reload** - Development mode with automatic reloading
- 🎨 **Multiple Patterns** - File-based routing, decorators, or manual registration
- 📁 **Organized Structure** - Automatic command and event loading from directories
- ⚡ **Zero Config** - Works out of the box with sensible defaults
- 🛠️ **Developer Tools** - Built-in command deployment and development server

## 🚀 Quick Start

### 1. Install the CLI

```bash
npm install -g djshandler-cli
```

### 2. Create a new bot project

```bash
djshandler create my-awesome-bot
cd my-awesome-bot
npm install
```

### 3. Configure your bot

```bash
cp .env.example .env
# Add your DISCORD_TOKEN and CLIENT_ID to .env
```

### 4. Start developing

```bash
npm run dev
```

That's it! Your bot is now running with hot reload enabled. 🎉

## 📦 Packages

This monorepo contains two packages:

### [`djshandler-core`](./packages/djshandler-core)
The core framework for command handling and event management.

```bash
npm install djshandler-core discord.js
```

### [`djshandler-cli`](./packages/djshandler-cli) 
CLI tool for project scaffolding and management.

```bash
npm install -g djshandler-cli
```

## 🎯 Core Concepts

### File-based Command Loading

```typescript
// src/commands/general/ping.ts
import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import type { Command } from 'djshandler-core'

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),
  
  async execute(interaction: CommandInteraction) {
    const ping = interaction.client.ws.ping
    await interaction.reply(`🏓 Pong! Latency: ${ping}ms`)
  }
}
```

### Event Handling

```typescript
// src/events/ready.ts
import { Events, Client } from 'discord.js'
import type { Event } from 'djshandler-core'

export const event: Event = {
  name: Events.Ready,
  once: true,
  
  async execute(client: Client) {
    console.log(`🤖 ${client.user?.tag} is online!`)
  }
}
```

### Main Bot File

```typescript
// src/index.ts
import { DJSHandler } from 'djshandler-core'
import { GatewayIntentBits } from 'discord.js'

const handler = new DJSHandler({
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  intents: [GatewayIntentBits.Guilds]
})

async function main() {
  await handler.loadCommands('./src/commands')
  await handler.loadEvents('./src/events')
  await handler.start()
}

main()
```

## 🛠️ CLI Commands

```bash
# Create a new project
djshandler create my-bot --typescript

# Add a new command
djshandler add command greet --category utility

# Add a new event  
djshandler add event memberJoin

# Start development server
djshandler dev

# Deploy commands to Discord
djshandler deploy --guild 123456789
```

## 🎨 Advanced Features

### Decorator Pattern (Optional)

```typescript
import { CommandClass, Execute } from 'djshandler-core'
import { CommandInteraction } from 'discord.js'

@CommandClass({
  name: 'hello',
  description: 'Say hello!',
  category: 'greetings'
})
export class HelloCommand {
  @Execute()
  async run(interaction: CommandInteraction) {
    await interaction.reply(`Hello, ${interaction.user}! 👋`)
  }
}
```

### Custom Command Loading

```typescript
import { DJSHandler } from 'djshandler-core'

const handler = new DJSHandler({ token: '...' })

// Manual registration
handler.registerCommand({
  data: new SlashCommandBuilder().setName('custom').setDescription('Custom command'),
  execute: async (interaction) => {
    await interaction.reply('Custom response!')
  }
})
```

## 📚 Project Templates

### Basic Template
- Simple ping command
- Ready event handler
- TypeScript/JavaScript options
- Environment configuration

### Advanced Template (Coming Soon)
- Database integration examples
- Middleware system
- Advanced error handling
- Logging and monitoring

### Slash-Only Template (Coming Soon)  
- Modern Discord interactions
- Application command permissions
- Autocomplete examples

## 🔧 Development

This project uses TurboRepo for monorepo management.

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

## 📖 Documentation

- [Core Framework Docs](./packages/djshandler-core/README.md)
- [CLI Tool Docs](./packages/djshandler-cli/README.md)
- [Examples Repository](https://github.com/username/djshandler-examples) (Coming Soon)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name](https://github.com/arpitbhalla1801)

---

<div align="center">
  <strong>Built with ❤️ for the Discord.js community</strong>
</div>
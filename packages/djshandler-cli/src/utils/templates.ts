interface Template {
  files: Record<string, string>
}

export function getTemplate(templateType: string, typescript: boolean): Template {
  switch (templateType) {
    case 'basic':
      return typescript ? getBasicTypeScriptTemplate() : getBasicJavaScriptTemplate()
    case 'advanced':
      return typescript ? getAdvancedTypeScriptTemplate() : getAdvancedJavaScriptTemplate()
    case 'slash-only':
      return typescript ? getSlashOnlyTypeScriptTemplate() : getSlashOnlyJavaScriptTemplate()
    default:
      return typescript ? getBasicTypeScriptTemplate() : getBasicJavaScriptTemplate()
  }
}

function getBasicTypeScriptTemplate(): Template {
  return {
    files: {
      'src/index.ts': `import { DJSHandler } from 'djshandler-core'
import { GatewayIntentBits } from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()

const handler = new DJSHandler({
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

async function main() {
  try {
    // Load commands and events
    await handler.loadCommands('./src/commands')
    await handler.loadEvents('./src/events')
    
    // Start the bot
    await handler.start()
  } catch (error) {
    console.error('Failed to start bot:', error)
    process.exit(1)
  }
}

main()
`,
      'src/commands/general/ping.ts': `import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import type { Command } from 'djshandler-core'

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  
  async execute(interaction: CommandInteraction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true })
    const ping = sent.createdTimestamp - interaction.createdTimestamp
    
    await interaction.editReply(\`🏓 Pong! Latency is \${ping}ms.\`)
  },
  
  category: 'general'
}
`,
      'src/events/ready.ts': `import { Events, Client } from 'discord.js'
import type { Event } from 'djshandler-core'

export const event: Event = {
  name: Events.Ready,
  once: true,
  
  async execute(client: Client) {
    console.log(\`Ready! Logged in as \${client.user?.tag}\`)
  }
}
`,
      '.env.example': `# Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
`,
      'tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`,
      'README.md': `# Discord Bot

A Discord bot built with djshandler framework.

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Copy environment file:
   \`\`\`
   cp .env.example .env
   \`\`\`

3. Add your bot token and client ID to \`.env\`

4. Start the bot:
   \`\`\`
   npm run dev
   \`\`\`

## Commands

- \`/ping\` - Check bot latency

## Development

- \`npm run build\` - Build the project
- \`npm run dev\` - Start in development mode
- \`npm run start\` - Start in production mode
`
    }
  }
}

function getBasicJavaScriptTemplate(): Template {
  return {
    files: {
      'src/index.js': `const { DJSHandler } = require('djshandler-core')
const { GatewayIntentBits } = require('discord.js')
require('dotenv').config()

const handler = new DJSHandler({
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

async function main() {
  try {
    // Load commands and events
    await handler.loadCommands('./src/commands')
    await handler.loadEvents('./src/events')
    
    // Start the bot
    await handler.start()
  } catch (error) {
    console.error('Failed to start bot:', error)
    process.exit(1)
  }
}

main()
`,
      'src/commands/general/ping.js': `const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true })
    const ping = sent.createdTimestamp - interaction.createdTimestamp
    
    await interaction.editReply(\`🏓 Pong! Latency is \${ping}ms.\`)
  },
  
  category: 'general'
}
`,
      'src/events/ready.js': `const { Events } = require('discord.js')

module.exports = {
  name: Events.Ready,
  once: true,
  
  async execute(client) {
    console.log(\`Ready! Logged in as \${client.user?.tag}\`)
  }
}
`,
      '.env.example': `# Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here
`,
      'README.md': `# Discord Bot

A Discord bot built with djshandler framework.

## Setup

1. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

2. Copy environment file:
   \`\`\`
   cp .env.example .env
   \`\`\`

3. Add your bot token and client ID to \`.env\`

4. Start the bot:
   \`\`\`
   npm run dev
   \`\`\`

## Commands

- \`/ping\` - Check bot latency

## Development

- \`npm run start\` - Start the bot
- \`npm run dev\` - Start with nodemon
`
    }
  }
}

// Additional template functions (shortened for brevity)
function getAdvancedTypeScriptTemplate(): Template {
  // TODO: Implement advanced template with middleware, database, etc.
  return getBasicTypeScriptTemplate()
}

function getAdvancedJavaScriptTemplate(): Template {
  // TODO: Implement advanced template
  return getBasicJavaScriptTemplate()
}

function getSlashOnlyTypeScriptTemplate(): Template {
  // TODO: Implement slash-only template
  return getBasicTypeScriptTemplate()
}

function getSlashOnlyJavaScriptTemplate(): Template {
  // TODO: Implement slash-only template
  return getBasicJavaScriptTemplate()
}

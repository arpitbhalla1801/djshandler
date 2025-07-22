# djshandler-cli

CLI tool for scaffolding and managing Discord.js bot projects with djshandler framework.

## Installation

```bash
npm install -g djshandler-cli
```

## Commands

### Create a new project

```bash
djshandler create my-bot
```

Interactive setup with options:
- **Template**: Basic, Advanced, or Slash-only
- **Language**: JavaScript or TypeScript
- **Project details**: Description, author, etc.

### Add commands and events

```bash
# Add a new command
djshandler add command greet --category utility --description "Greet users"

# Add a new event
djshandler add event memberJoin
```

### Development server

```bash
djshandler dev
```

Start your bot in development mode with hot reload.

### Deploy commands

```bash
# Deploy to test guild
djshandler deploy --guild 123456789

# Deploy globally (takes up to 1 hour)
djshandler deploy --global
```

## Templates

### Basic Template
- Simple command handler setup
- Ping command example
- Ready event example
- Environment configuration

### Advanced Template (Coming Soon)
- Database integration examples
- Middleware system
- Advanced error handling
- Logging and monitoring

### Slash-Only Template (Coming Soon)
- Modern slash commands only
- Application command permissions
- Autocomplete examples

## Project Structure

```
my-bot/
├── src/
│   ├── commands/
│   │   └── general/
│   │       └── ping.ts
│   ├── events/
│   │   └── ready.ts
│   └── index.ts
├── .env.example
├── package.json
└── README.md
```

## Configuration

### Environment Variables

```env
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_test_guild_id_here
```

### Package Scripts

- `npm run build` - Build TypeScript project
- `npm run dev` - Start with hot reload
- `npm start` - Start in production
- `npm run deploy` - Deploy slash commands

## Examples

### Creating a new bot

```bash
$ djshandler create awesome-bot
🚀 Creating new djshandler project: awesome-bot

? Choose a project template: Basic Bot - Simple command handler setup
? Use TypeScript? Yes
? Project description: My awesome Discord bot
? Author name: John Doe

✅ Project created successfully!

Next steps:
  cd awesome-bot
  npm install
  cp .env.example .env
  # Add your bot token to .env
  npm run dev
```

### Adding a command

```bash
$ djshandler add command hello --category greetings --description "Say hello to users"
➕ Adding new command: hello
✅ Created command: hello
   📁 src/commands/greetings/hello.ts
```

## Requirements

- Node.js 18+ 
- Discord.js 14+
- A Discord bot token

## License

MIT

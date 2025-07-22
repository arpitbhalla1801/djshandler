#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import { createProject } from './commands/create'
import { addCommand } from './commands/add'
import { devServer } from './commands/dev'
import { deployCommands } from './commands/deploy'

const program = new Command()

program
  .name('djshandler')
  .description('CLI tool for Discord.js bot development with djshandler framework')
  .version('0.1.0')

// Create command
program
  .command('create')
  .argument('<project-name>', 'Name of the project to create')
  .description('Create a new Discord.js bot project')
  .option('-t, --template <template>', 'Project template (basic, advanced, slash-only)', 'basic')
  .option('-ts, --typescript', 'Use TypeScript', false)
  .option('-y, --yes', 'Skip prompts and use defaults', false)
  .action(createProject)

// Add command
program
  .command('add')
  .argument('<type>', 'Type to add (command, event)')
  .argument('<name>', 'Name of the command/event')
  .description('Add a new command or event to the project')
  .option('-c, --category <category>', 'Command category')
  .option('-d, --description <description>', 'Command description')
  .action(addCommand)

// Dev command
program
  .command('dev')
  .description('Start the bot in development mode with hot reload')
  .option('-p, --port <port>', 'Port for the dev server', '3000')
  .action(devServer)

// Deploy command
program
  .command('deploy')
  .description('Deploy slash commands to Discord')
  .option('-g, --guild <guildId>', 'Deploy to specific guild (for testing)')
  .option('--global', 'Deploy globally (takes up to 1 hour)')
  .action(deployCommands)

// Parse arguments
program.parse()

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log(chalk.blue.bold('🔥 djshandler CLI'))
  console.log(chalk.gray('The Express.js of Discord bots'))
  console.log()
  program.help()
}

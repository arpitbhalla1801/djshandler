import * as fs from 'fs-extra'
import * as path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'

interface AddOptions {
  category?: string
  description?: string
}

export async function addCommand(type: string, name: string, options: AddOptions) {
  console.log(chalk.blue.bold(`➕ Adding new ${type}: ${name}`))

  const cwd = process.cwd()
  
  // Check if we're in a djshandler project
  const packageJsonPath = path.join(cwd, 'package.json')
  if (!await fs.pathExists(packageJsonPath)) {
    console.error(chalk.red('❌ Not in a valid project directory'))
    process.exit(1)
  }

  const packageJson = await fs.readJSON(packageJsonPath)
  if (!packageJson.dependencies?.['djshandler-core']) {
    console.error(chalk.red('❌ This is not a djshandler project'))
    process.exit(1)
  }

  const isTypeScript = await fs.pathExists(path.join(cwd, 'tsconfig.json'))
  const fileExtension = isTypeScript ? '.ts' : '.js'
  
  switch (type.toLowerCase()) {
    case 'command':
      await addCommandFile(cwd, name, options, fileExtension)
      break
    case 'event':
      await addEventFile(cwd, name, fileExtension)
      break
    default:
      console.error(chalk.red(`❌ Unknown type: ${type}. Use 'command' or 'event'`))
      process.exit(1)
  }
}

async function addCommandFile(cwd: string, name: string, options: AddOptions, extension: string) {
  const commandsDir = path.join(cwd, 'src', 'commands')
  await fs.ensureDir(commandsDir)
  
  const category = options.category || 'general'
  const categoryDir = path.join(commandsDir, category)
  await fs.ensureDir(categoryDir)
  
  const filePath = path.join(categoryDir, `${name}${extension}`)
  
  if (await fs.pathExists(filePath)) {
    console.error(chalk.red(`❌ Command ${name} already exists in category ${category}`))
    process.exit(1)
  }

  const description = options.description || `${name} command`
  
  const content = extension === '.ts' ? 
    generateTypeScriptCommand(name, description) : 
    generateJavaScriptCommand(name, description)
  
  await fs.writeFile(filePath, content, 'utf8')
  
  console.log(chalk.green(`✅ Created command: ${chalk.bold(name)}`))
  console.log(chalk.gray(`   📁 ${path.relative(cwd, filePath)}`))
}

async function addEventFile(cwd: string, name: string, extension: string) {
  const eventsDir = path.join(cwd, 'src', 'events')
  await fs.ensureDir(eventsDir)
  
  const filePath = path.join(eventsDir, `${name}${extension}`)
  
  if (await fs.pathExists(filePath)) {
    console.error(chalk.red(`❌ Event ${name} already exists`))
    process.exit(1)
  }

  // Prompt for event details
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'eventName',
      message: 'Select Discord.js event:',
      choices: [
        'ready', 'messageCreate', 'interactionCreate', 'guildCreate', 
        'guildDelete', 'guildMemberAdd', 'guildMemberRemove', 'voiceStateUpdate'
      ],
      default: 'ready'
    },
    {
      type: 'confirm',
      name: 'once',
      message: 'Is this a one-time event?',
      default: false
    }
  ])
  
  const content = extension === '.ts' ? 
    generateTypeScriptEvent(name, answers.eventName, answers.once) : 
    generateJavaScriptEvent(name, answers.eventName, answers.once)
  
  await fs.writeFile(filePath, content, 'utf8')
  
  console.log(chalk.green(`✅ Created event: ${chalk.bold(name)}`))
  console.log(chalk.gray(`   📁 ${path.relative(cwd, filePath)}`))
}

function generateTypeScriptCommand(name: string, description: string): string {
  return `import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import type { Command } from 'djshandler-core'

export const command: Command = {
  data: new SlashCommandBuilder()
    .setName('${name.toLowerCase()}')
    .setDescription('${description}'),
  
  async execute(interaction: CommandInteraction) {
    await interaction.reply({
      content: 'Hello from ${name} command!',
      ephemeral: true
    })
  },
  
  category: 'general'
}
`
}

function generateJavaScriptCommand(name: string, description: string): string {
  return `const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('${name.toLowerCase()}')
    .setDescription('${description}'),
  
  async execute(interaction) {
    await interaction.reply({
      content: 'Hello from ${name} command!',
      ephemeral: true
    })
  },
  
  category: 'general'
}
`
}

function generateTypeScriptEvent(name: string, eventName: string, once: boolean): string {
  return `import { Events } from 'discord.js'
import type { Event } from 'djshandler-core'

export const event: Event = {
  name: Events.${eventName.charAt(0).toUpperCase() + eventName.slice(1)} as keyof typeof Events,
  once: ${once},
  
  async execute(...args: any[]) {
    console.log('${name} event triggered:', args)
    // Add your event logic here
  }
}
`
}

function generateJavaScriptEvent(name: string, eventName: string, once: boolean): string {
  return `const { Events } = require('discord.js')

module.exports = {
  name: Events.${eventName.charAt(0).toUpperCase() + eventName.slice(1)},
  once: ${once},
  
  async execute(...args) {
    console.log('${name} event triggered:', args)
    // Add your event logic here
  }
}
`
}

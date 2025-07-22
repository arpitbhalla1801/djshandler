import * as fs from 'fs-extra'
import * as path from 'path'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { getTemplate } from '../utils/templates'

interface CreateOptions {
  template: string
  typescript: boolean
  yes: boolean
}

export async function createProject(projectName: string, options: CreateOptions) {
  console.log(chalk.blue.bold(`🚀 Creating new djshandler project: ${projectName}`))
  
  const projectPath = path.resolve(process.cwd(), projectName)
  
  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    console.error(chalk.red(`❌ Directory ${projectName} already exists!`))
    process.exit(1)
  }

  // Prompt for additional options if not using --yes
  let answers: any = {}
  if (!options.yes) {
    answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Choose a project template:',
        choices: [
          { name: 'Basic Bot - Simple command handler setup', value: 'basic' },
          { name: 'Advanced Bot - Full featured with events and middleware', value: 'advanced' },
          { name: 'Slash Commands Only - Modern slash commands bot', value: 'slash-only' }
        ],
        default: options.template
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Use TypeScript?',
        default: options.typescript
      },
      {
        type: 'input',
        name: 'description',
        message: 'Project description:',
        default: `A Discord bot built with djshandler`
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author name:',
        default: ''
      }
    ])
  }

  const config = {
    name: projectName,
    template: answers.template || options.template,
    typescript: answers.typescript || options.typescript,
    description: answers.description || `A Discord bot built with djshandler`,
    author: answers.author || ''
  }

  try {
    // Create project directory
    await fs.ensureDir(projectPath)
    
    // Generate template files
    await generateTemplate(projectPath, config)
    
    console.log(chalk.green.bold('✅ Project created successfully!'))
    console.log()
    console.log(chalk.yellow('Next steps:'))
    console.log(chalk.gray(`  cd ${projectName}`))
    console.log(chalk.gray('  npm install'))
    console.log(chalk.gray('  cp .env.example .env'))
    console.log(chalk.gray('  # Add your bot token to .env'))
    console.log(chalk.gray('  npm run dev'))
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to create project:'), error)
    process.exit(1)
  }
}

async function generateTemplate(projectPath: string, config: any) {
  const template = getTemplate(config.template, config.typescript)
  
  // Generate package.json
  const packageJson = {
    name: config.name,
    version: '1.0.0',
    description: config.description,
    main: config.typescript ? 'dist/index.js' : 'src/index.js',
    scripts: config.typescript ? {
      'build': 'tsc',
      'start': 'node dist/index.js',
      'dev': 'tsx watch src/index.ts',
      'deploy': 'node dist/deploy.js'
    } : {
      'start': 'node src/index.js',
      'dev': 'nodemon src/index.js',
      'deploy': 'node src/deploy.js'
    },
    keywords: ['discord', 'bot', 'djshandler'],
    author: config.author,
    license: 'MIT',
    dependencies: {
      'discord.js': '^14.14.1',
      'djshandler-core': '^0.1.0',
      'dotenv': '^16.4.1'
    },
    devDependencies: config.typescript ? {
      '@types/node': '^20.11.17',
      'typescript': '^5.3.3',
      'tsx': '^4.7.1'
    } : {
      'nodemon': '^3.0.3'
    }
  }

  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 })

  // Generate template files
  for (const [filePath, content] of Object.entries(template.files)) {
    const fullPath = path.join(projectPath, filePath)
    await fs.ensureDir(path.dirname(fullPath))
    await fs.writeFile(fullPath, content, 'utf8')
  }

  console.log(chalk.green(`📁 Generated ${Object.keys(template.files).length} files`))
}

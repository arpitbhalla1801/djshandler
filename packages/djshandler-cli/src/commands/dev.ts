import chalk from 'chalk'
import { spawn } from 'child_process'
import * as fs from 'fs-extra'
import * as path from 'path'

interface DevOptions {
  port: string
}

export async function devServer(options: DevOptions) {
  console.log(chalk.blue.bold('� Starting djshandler development server...'))
  
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

  // Check if .env file exists
  const envPath = path.join(cwd, '.env')
  if (!await fs.pathExists(envPath)) {
    console.warn(chalk.yellow('⚠️  .env file not found. Creating from template...'))
    
    const envExample = `# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_for_testing

# Development Settings
NODE_ENV=development
DEV_PORT=${options.port}
`
    await fs.writeFile(envPath, envExample, 'utf8')
    console.log(chalk.green('✅ Created .env file from template'))
    console.log(chalk.yellow('💡 Please add your bot token and client ID to the .env file'))
  }

  // Determine if TypeScript project
  const isTypeScript = await fs.pathExists(path.join(cwd, 'tsconfig.json'))
  
  console.log(chalk.cyan(`📁 Project type: ${isTypeScript ? 'TypeScript' : 'JavaScript'}`))
  console.log(chalk.cyan(`🌐 Dev server port: ${options.port}`))
  console.log(chalk.gray('👀 Watching for changes...'))
  console.log()

  // Start the appropriate dev command
  const command = 'npm'
  const args = ['run', 'dev']
  
  const devProcess = spawn(command, args, {
    stdio: 'inherit',
    cwd,
    env: { ...process.env, DEV_PORT: options.port }
  })

  devProcess.on('error', (error) => {
    console.error(chalk.red('❌ Failed to start dev server:'), error)
    process.exit(1)
  })

  devProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(chalk.red(`❌ Dev server exited with code ${code}`))
      process.exit(1)
    }
  })

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log(chalk.yellow('\n🛑 Shutting down dev server...'))
    devProcess.kill('SIGINT')
  })

  process.on('SIGTERM', () => {
    console.log(chalk.yellow('\n🛑 Shutting down dev server...'))
    devProcess.kill('SIGTERM')
  })
}

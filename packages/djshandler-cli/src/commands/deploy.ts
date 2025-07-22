import chalk from 'chalk'
import * as fs from 'fs-extra'
import * as path from 'path'
import { spawn } from 'child_process'

interface DeployOptions {
  guild?: string
  global: boolean
}

export async function deployCommands(options: DeployOptions) {
  console.log(chalk.blue.bold('🚀 Deploying slash commands...'))
  
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

  // Check if .env file exists and has required tokens
  const envPath = path.join(cwd, '.env')
  if (!await fs.pathExists(envPath)) {
    console.error(chalk.red('❌ .env file not found'))
    console.log(chalk.gray('Create a .env file with DISCORD_TOKEN and CLIENT_ID'))
    process.exit(1)
  }

  if (options.guild) {
    console.log(chalk.gray(`🎯 Deploying to guild: ${options.guild}`))
  } else if (options.global) {
    console.log(chalk.yellow('🌍 Deploying globally (may take up to 1 hour)'))
    console.log(chalk.gray('Global commands are cached and updates may take time to propagate'))
  } else {
    console.log(chalk.gray('🏠 Deploying to guild specified in config'))
  }
  
  // Build project first if TypeScript
  const isTypeScript = await fs.pathExists(path.join(cwd, 'tsconfig.json'))
  if (isTypeScript) {
    console.log(chalk.cyan('🔧 Building project...'))
    await runCommand('npm', ['run', 'build'], cwd)
  }

  // Create deploy script arguments
  const args = ['run', 'deploy']
  if (options.guild) {
    process.env.GUILD_ID = options.guild
  } else if (options.global) {
    process.env.DEPLOY_GLOBAL = 'true'
  }

  try {
    console.log(chalk.cyan('📤 Deploying commands...'))
    await runCommand('npm', args, cwd)
    console.log(chalk.green('✅ Commands deployed successfully!'))
  } catch (error) {
    console.error(chalk.red('❌ Failed to deploy commands:'), error)
    process.exit(1)
  }
}

function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      stdio: 'inherit',
      cwd,
      env: { ...process.env }
    })

    childProcess.on('error', reject)
    childProcess.on('close', (code: number | null) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Command failed with exit code ${code}`))
      }
    })
  })
}

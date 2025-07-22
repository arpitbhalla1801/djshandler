import * as fs from 'fs/promises'
import * as path from 'path'

/**
 * Utility functions for the djshandler framework
 */

/**
 * Recursively load all files from a directory with a specific extension
 */
export async function loadFiles(dirPath: string, extension: string = '.js'): Promise<string[]> {
  const files: string[] = []
  
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name)
      
      if (item.isDirectory()) {
        const subFiles = await loadFiles(fullPath, extension)
        files.push(...subFiles)
      } else if (item.isFile() && item.name.endsWith(extension)) {
        files.push(fullPath)
      }
    }
  } catch (error) {
    console.warn(`Could not read directory ${dirPath}:`, error)
  }
  
  return files
}

/**
 * Dynamically import a module from a file path
 */
export async function importModule<T = any>(filePath: string): Promise<T | null> {
  try {
    const module = await import(filePath)
    return module.default || module
  } catch (error) {
    console.warn(`Could not import module from ${filePath}:`, error)
    return null
  }
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Create directory recursively if it doesn't exist
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    console.warn(`Could not create directory ${dirPath}:`, error)
  }
}

/**
 * Format command name to be Discord-compatible
 */
export function formatCommandName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Validate Discord command name
 */
export function isValidCommandName(name: string): boolean {
  return /^[a-z0-9-_]{1,32}$/.test(name)
}

/**
 * Simple logger utility
 */
export class Logger {
  constructor(private prefix: string = 'DJSHandler') {}

  info(message: string, ...args: any[]): void {
    console.log(`[${this.prefix}] ${message}`, ...args)
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[${this.prefix}] ${message}`, ...args)
  }

  error(message: string, ...args: any[]): void {
    console.error(`[${this.prefix}] ${message}`, ...args)
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.prefix}] ${message}`, ...args)
    }
  }
}

/**
 * Default logger instance
 */
export const logger = new Logger()

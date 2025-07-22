import 'reflect-metadata'
import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import type { Command, Event, CommandMetadata, EventMetadata } from './types'

// Metadata keys for reflection
const COMMAND_METADATA_KEY = Symbol('command')
const EVENT_METADATA_KEY = Symbol('event')

/**
 * Class decorator to mark a class as a command
 */
export function CommandClass(metadata: CommandMetadata) {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    Reflect.defineMetadata(COMMAND_METADATA_KEY, metadata, constructor)
    return constructor
  }
}

/**
 * Method decorator to mark a method as a command execute function
 */
export function Execute() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Mark this method as the execute function
    Reflect.defineMetadata('execute', true, target, propertyKey)
  }
}

/**
 * Class decorator to mark a class as an event handler
 */
export function EventClass(metadata: EventMetadata) {
  return function <T extends new (...args: any[]) => any>(constructor: T) {
    Reflect.defineMetadata(EVENT_METADATA_KEY, metadata, constructor)
    return constructor
  }
}

/**
 * Method decorator to mark a method as an event execute function
 */
export function On(eventName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('eventName', eventName, target, propertyKey)
    Reflect.defineMetadata('once', false, target, propertyKey)
  }
}

/**
 * Method decorator to mark a method as a once event execute function
 */
export function Once(eventName: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('eventName', eventName, target, propertyKey)
    Reflect.defineMetadata('once', true, target, propertyKey)
  }
}

/**
 * Utility function to extract command from decorated class
 */
export function extractCommand(CommandClass: new (...args: any[]) => any): Command | null {
  const metadata = Reflect.getMetadata(COMMAND_METADATA_KEY, CommandClass) as CommandMetadata
  if (!metadata) return null

  const instance = new CommandClass()
  
  // Find the execute method
  const prototype = Object.getPrototypeOf(instance)
  const methods = Object.getOwnPropertyNames(prototype)
  
  let executeMethod: Function | null = null
  for (const method of methods) {
    if (Reflect.getMetadata('execute', prototype, method)) {
      executeMethod = instance[method].bind(instance)
      break
    }
  }

  if (!executeMethod) return null

  // Build the slash command
  const commandBuilder = new SlashCommandBuilder()
    .setName(metadata.name)
    .setDescription(metadata.description)

  return {
    data: commandBuilder,
    execute: executeMethod as (interaction: CommandInteraction) => Promise<void> | void,
    category: metadata.category,
    disabled: metadata.disabled,
    cooldown: metadata.cooldown
  }
}

/**
 * Utility function to extract event from decorated class
 */
export function extractEvent(EventClass: new (...args: any[]) => any): Event | null {
  const metadata = Reflect.getMetadata(EVENT_METADATA_KEY, EventClass) as EventMetadata
  if (!metadata) return null

  const instance = new EventClass()
  
  // Find methods with event metadata
  const prototype = Object.getPrototypeOf(instance)
  const methods = Object.getOwnPropertyNames(prototype)
  
  let executeMethod: Function | null = null
  for (const method of methods) {
    const eventName = Reflect.getMetadata('eventName', prototype, method)
    if (eventName) {
      executeMethod = instance[method].bind(instance)
      break
    }
  }

  if (!executeMethod) return null

  return {
    name: metadata.name,
    once: metadata.once,
    execute: executeMethod as (...args: any[]) => Promise<void> | void
  }
}

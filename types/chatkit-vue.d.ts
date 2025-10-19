declare module 'chatkit-vue' {
  import type { Component } from 'vue'

  export interface HostedClientSecretOptions {
    url: string
    method?: 'POST' | 'GET'
    headers?: () => Record<string, string>
    body?: () => any
  }

  export interface FontSource {
    family: string
    src: string
    weight: number
    style: string
    display: string
  }

  export interface Typography {
    baseSize?: number
    fontFamily?: string
    fontFamilyMono?: string
    fontSources?: FontSource[]
  }

  export interface Theme {
    colorScheme?: 'light' | 'dark' | 'auto'
    radius?: 'none' | 'small' | 'medium' | 'large' | 'pill'
    density?: 'compact' | 'normal' | 'comfortable'
    typography?: Typography
  }

  export interface Attachments {
    enabled?: boolean
    maxCount?: number
    maxSize?: number
  }

  export interface Composer {
    attachments?: Attachments
    tools?: any[]
  }

  export interface StartScreenPrompt {
    icon?: string
    label: string
    prompt: string
  }

  export interface StartScreen {
    greeting?: string
    prompts?: StartScreenPrompt[]
  }

  export interface ChatKitOptions {
    api: any
    theme?: Theme | 'light' | 'dark' | 'auto'
    composer?: Composer
    startScreen?: StartScreen
    header?: { enabled?: boolean }
    locale?: string
    initialThread?: any
    threadItemActions?: any
    onClientTool?: any
    entities?: any
    widgets?: any
  }

  export interface ChatKitControl {
    sendUserMessage?: (message: { text: string }) => Promise<void>
  }

  export interface UseChatKitReturn {
    control: any
    sendUserMessage?: (message: { text: string }) => Promise<void>
    ref?: any
  }

  export function createHostedClientSecret(
    options: HostedClientSecretOptions
  ): any
  export function useChatKit(options: ChatKitOptions): UseChatKitReturn
  export const ChatKit: Component
  export const ChatKitRoot: Component
  export const ChatHistory: Component
  export const ChatMessageList: Component
  export const ChatMessageBubble: Component
  export const ChatComposer: Component
  export const WidgetRenderer: Component
}

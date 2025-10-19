declare module '@openai/chatkit'

declare global {
  interface Window {
    ChatKit?: {
      mount: (element: HTMLElement, options: ChatKitOptions) => void
    }
  }

  interface ChatKitOptions {
    api: {
      getClientSecret: (existing: string | null) => Promise<string>
    }
    theme?: {
      colorScheme?: 'light' | 'dark' | 'auto'
    }
  }

  namespace JSX {
    interface IntrinsicElements {
      'openai-chatkit': {
        'workflow-id'?: string
        'public-key'?: string
        'client-secret'?: string
        theme?: 'light' | 'dark' | 'auto'
        version?: string
        [key: string]: any
      }
    }
  }
}

export {}

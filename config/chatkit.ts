import type { ChatKitOptions } from 'chatkit-vue'

export const chatkitConfig: Omit<ChatKitOptions, 'api'> = {
  theme: {
    colorScheme: 'dark' as const,
    radius: 'pill' as const,
    density: 'normal' as const,
    typography: {
      baseSize: 16,
      fontFamily:
        '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontFamilyMono:
        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
      fontSources: [
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
          weight: 400,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Medium.woff2',
          weight: 500,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Bold.woff2',
          weight: 700,
          style: 'normal',
          display: 'swap',
        },
      ],
    },
  },
  composer: {
    attachments: {
      enabled: true,
      maxCount: 5,
      maxSize: 10485760,
    },
  },
  startScreen: {
    greeting: 'Calculate your Basal Metabolic Rate (BMR)',
    prompts: [
      {
        label: 'Calculate my BMR',
        prompt: 'I want to calculate my BMR',
        icon: 'analytics',
      },
      {
        label: 'What is BMR?',
        prompt: 'What is Basal Metabolic Rate and why is it important?',
        icon: 'lightbulb',
      },
      {
        label: 'Get started',
        prompt: 'Help me calculate my daily caloric needs',
        icon: 'sparkle',
      },
    ],
  },
  widgets: {
    onAction: async (action: any, widgetItem: any) => {
      console.log('Widget action triggered:', action, widgetItem)
      // Handle widget actions here if needed
    },
  },
}

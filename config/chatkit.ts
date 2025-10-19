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
      enabled: false, // Requires full ChatKitServer with AttachmentStore implementation
    },
  },
  startScreen: {
    greeting: 'Basal Metabolic Rate Agent by Landen English',
    prompts: [
      {
        label: 'Get started',
        prompt: "Let's get started",
        icon: 'play',
      },
    ],
  },
}

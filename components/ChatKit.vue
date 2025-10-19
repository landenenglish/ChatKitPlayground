<script setup lang="ts">
import { ChatKit, useChatKit } from 'chatkit-vue'

const config = useRuntimeConfig()

// Use public-key approach (simpler, frontend-only)
const { control } = useChatKit({
  api: {
    domainKey: config.public.domainKey,
    workflowId: config.public.workflowId,
  },
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
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-SemiBold.woff2',
          weight: 600,
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
    greeting: '',
    prompts: [],
  },
})
</script>

<template>
  <ClientOnly>
    <ChatKit :control="control" class="h-full w-full" />
    <template #fallback>
      <div class="flex h-full w-full items-center justify-center bg-black">
        <span class="text-white">Initializing...</span>
      </div>
    </template>
  </ClientOnly>
</template>

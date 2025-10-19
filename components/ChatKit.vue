<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ChatKit, useChatKit, createHostedClientSecret } from 'chatkit-vue'

const isLoading = ref(true)

// Use OpenAI hosted backend with session endpoint
const hosted = createHostedClientSecret({
  url: '/api/chatkit/session',
  method: 'POST',
})

// Hide loader when ChatKit is ready
onMounted(async () => {
  await nextTick()

  // Wait for ChatKit to be fully rendered and initialized
  setTimeout(() => {
    const checkChatKitReady = () => {
      const chatKitElement = document.querySelector('openai-chatkit')
      if (chatKitElement) {
        // Give a small delay to ensure smooth transition
        setTimeout(() => {
          isLoading.value = false
        }, 100)
      } else {
        requestAnimationFrame(checkChatKitReady)
      }
    }

    checkChatKitReady()
  }, 500)
})

const { control } = useChatKit({
  api: hosted,
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
    greeting: '',
    prompts: [],
  },
})
</script>

<template>
  <div class="relative h-full w-full">
    <ClientOnly>
      <ChatKit :control="control" class="h-full w-full" />
    </ClientOnly>

    <!-- Loading overlay -->
    <div
      v-if="isLoading"
      class="absolute inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div class="relative h-16 w-16">
        <!-- Outer ring -->
        <div
          class="absolute inset-0 rounded-full border-2 border-transparent"
          style="
            border-top-color: rgba(255, 255, 255, 0.2);
            border-right-color: rgba(255, 255, 255, 0.2);
            animation: spin 1.5s linear infinite;
          "
        ></div>
        <!-- Middle ring -->
        <div
          class="absolute rounded-full border-2 border-transparent"
          style="
            top: 0.5rem;
            right: 0.5rem;
            bottom: 0.5rem;
            left: 0.5rem;
            border-top-color: rgba(255, 255, 255, 0.4);
            border-right-color: rgba(255, 255, 255, 0.4);
            animation: spin 1s linear infinite reverse;
          "
        ></div>
        <!-- Inner ring -->
        <div
          class="absolute rounded-full border-2 border-transparent"
          style="
            top: 1rem;
            right: 1rem;
            bottom: 1rem;
            left: 1rem;
            border-top-color: rgba(255, 255, 255, 1);
            border-right-color: rgba(255, 255, 255, 1);
            animation: spin 0.75s linear infinite;
          "
        ></div>
        <!-- Center dot -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div
            class="h-2 w-2 rounded-full bg-white"
            style="animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

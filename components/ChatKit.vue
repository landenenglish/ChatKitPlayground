<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ChatKit, useChatKit, createHostedClientSecret } from 'chatkit-vue'
import { chatkitConfig } from '~/config/chatkit'

const isLoading = ref(true)

const hosted = createHostedClientSecret({
  url: '/api/chatkit/session',
  method: 'POST',
})

const { control } = useChatKit({
  api: hosted,
  ...chatkitConfig,
})

onMounted(async () => {
  await nextTick()
  setTimeout(() => {
    const checkReady = () => {
      const el = document.querySelector('openai-chatkit')
      if (el) {
        setTimeout(() => (isLoading.value = false), 100)
      } else {
        requestAnimationFrame(checkReady)
      }
    }
    checkReady()
  }, 500)
})
</script>

<template>
  <div class="relative h-full w-full">
    <ClientOnly>
      <ChatKit :control="control" class="h-full w-full" />
    </ClientOnly>

    <div
      v-if="isLoading"
      class="absolute inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div class="relative h-16 w-16">
        <div
          class="absolute inset-0 rounded-full border-2 border-transparent"
          style="
            border-top-color: rgba(255, 255, 255, 0.2);
            border-right-color: rgba(255, 255, 255, 0.2);
            animation: spin 1.5s linear infinite;
          "
        ></div>
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

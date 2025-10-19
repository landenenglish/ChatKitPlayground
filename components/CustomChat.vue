<script setup lang="ts">
import { ref, nextTick } from 'vue'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

const messages = ref<Message[]>([])
const inputText = ref('')
const isLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage: Message = {
    id: `msg_${Date.now()}`,
    role: 'user',
    content: inputText.value,
  }

  messages.value.push(userMessage)
  const userInput = inputText.value
  inputText.value = ''
  isLoading.value = true

  await scrollToBottom()

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: messages.value.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    // Create assistant message placeholder
    const assistantMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      isStreaming: true,
    }
    messages.value.push(assistantMessage)
    await scrollToBottom()

    // Read the stream
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))

              if (data.type === 'thread.item.delta') {
                assistantMessage.content += data.delta.text
                await scrollToBottom()
              } else if (data.type === 'thread.item.done') {
                assistantMessage.isStreaming = false
                if (data.item.content && data.item.content[0]) {
                  assistantMessage.content = data.item.content[0].text
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: 'Sorry, there was an error processing your message.',
    })
  } finally {
    isLoading.value = false
    await scrollToBottom()
  }
}

const handleKeypress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}
</script>

<template>
  <div class="flex h-full w-full flex-col bg-gray-900">
    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 py-6 space-y-4"
    >
      <div v-if="messages.length === 0" class="flex h-full items-center justify-center">
        <div class="text-center text-gray-400">
          <h2 class="text-2xl font-semibold mb-2">Mifflin-St Jeor Calculator</h2>
          <p>Ask me about calculating your daily caloric needs</p>
        </div>
      </div>

      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'flex',
          message.role === 'user' ? 'justify-end' : 'justify-start',
        ]"
      >
        <div
          :class="[
            'max-w-[80%] rounded-2xl px-4 py-3',
            message.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-800 text-gray-100',
          ]"
        >
          <p class="whitespace-pre-wrap break-words">{{ message.content }}</p>
          <span
            v-if="message.isStreaming"
            class="inline-block w-2 h-4 bg-current animate-pulse ml-1"
          ></span>
        </div>
      </div>
    </div>

    <!-- Input Container -->
    <div class="border-t border-gray-800 p-4">
      <div class="flex items-end gap-2">
        <textarea
          v-model="inputText"
          :disabled="isLoading"
          @keypress="handleKeypress"
          placeholder="Type your message..."
          rows="1"
          class="flex-1 resize-none rounded-lg bg-gray-800 px-4 py-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="isLoading || !inputText.trim()"
          class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Sending...' : 'Send' }}
        </button>
      </div>
    </div>
  </div>
</template>


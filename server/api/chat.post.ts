import {
  defineEventHandler,
  readBody,
  createError,
  setResponseHeader,
} from 'h3'
import { runWorkflow } from '../workflows/mifflin-st-jeor'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { messages } = body

  if (!messages || messages.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'Messages are required',
    })
  }

  // Get the last user message
  const lastMessage = messages[messages.length - 1]
  const messageText = lastMessage.content || lastMessage.text || ''

  console.log('Received chat message:', messageText)

  try {
    // Set headers for Server-Sent Events
    setResponseHeader(event, 'Content-Type', 'text/event-stream')
    setResponseHeader(event, 'Cache-Control', 'no-cache')
    setResponseHeader(event, 'Connection', 'keep-alive')

    // Run the workflow
    const result = await runWorkflow({ input_as_text: messageText })

    // Stream the response
    const responseText = result?.output_text || 'No response generated'

    // Create a readable stream that sends events in ChatKit format
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send thread created event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'thread.created',
                thread: { id: `thread_${Date.now()}`, status: 'active' },
              })}\n\n`
            )
          )

          // Send user message done event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'thread.item.done',
                item: {
                  id: `item_${Date.now()}`,
                  type: 'user_message',
                  content: [{ type: 'input_text', text: messageText }],
                },
              })}\n\n`
            )
          )

          // Send assistant message streaming events
          const messageId = `item_${Date.now() + 1}`

          // Start assistant message
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'thread.item.created',
                item: {
                  id: messageId,
                  type: 'assistant_message',
                  status: 'in_progress',
                },
              })}\n\n`
            )
          )

          // Stream content in chunks
          const words = responseText.split(' ')
          for (let i = 0; i < words.length; i++) {
            const word = words[i]
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'thread.item.delta',
                  item: { id: messageId },
                  delta: { type: 'text', text: word + ' ' },
                })}\n\n`
              )
            )

            // Small delay to simulate streaming
            await new Promise((resolve) => setTimeout(resolve, 50))
          }

          // Complete assistant message
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'thread.item.done',
                item: {
                  id: messageId,
                  type: 'assistant_message',
                  content: [{ type: 'output_text', text: responseText }],
                  status: 'completed',
                },
              })}\n\n`
            )
          )

          controller.close()
        } catch (err) {
          console.error('Stream error:', err)
          controller.error(err)
        }
      },
    })

    return stream
  } catch (error: any) {
    console.error('Workflow execution error:', error)

    // Send error as SSE
    const encoder = new TextEncoder()
    const errorStream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'error',
              code: 'stream.error',
              message: error.message || 'Failed to execute workflow',
            })}\n\n`
          )
        )
        controller.close()
      },
    })

    return errorStream
  }
})


export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.openaiApiKey
  const workflowId = config.public.workflowId

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OPENAI_API_KEY not configured',
    })
  }

  if (!workflowId) {
    throw createError({
      statusCode: 500,
      message: 'NUXT_PUBLIC_WORKFLOW_ID not configured',
    })
  }

  // Prevent caching of session tokens
  setHeader(
    event,
    'Cache-Control',
    'no-store, no-cache, must-revalidate, proxy-revalidate'
  )
  setHeader(event, 'Pragma', 'no-cache')
  setHeader(event, 'Expires', '0')

  try {
    const userId = `user_${Date.now()}`

    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        workflow: {
          id: workflowId,
        },
        user: userId,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw createError({
        statusCode: response.status,
        message: `OpenAI API error: ${response.statusText} - ${errorText}`,
      })
    }

    const data = await response.json()

    return {
      client_secret: data.client_secret,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create ChatKit session',
    })
  }
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.openaiApiKey
  const workflowId = config.public.workflowId

  console.log('Session endpoint called')
  console.log('API Key exists:', !!apiKey)
  console.log('Workflow ID:', workflowId)

  if (!apiKey) {
    console.error('Missing OPENAI_API_KEY')
    throw createError({
      statusCode: 500,
      message: 'OPENAI_API_KEY not configured',
    })
  }

  if (!workflowId) {
    console.error('Missing NUXT_PUBLIC_WORKFLOW_ID')
    throw createError({
      statusCode: 500,
      message: 'NUXT_PUBLIC_WORKFLOW_ID not configured',
    })
  }

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
      console.error('OpenAI API error:', response.status, response.statusText)
      console.error('OpenAI error details:', errorText)
      throw createError({
        statusCode: response.status,
        message: `OpenAI API error: ${response.statusText} - ${errorText}`,
      })
    }

    const data = await response.json()
    console.log('Session created successfully')

    return {
      client_secret: data.client_secret,
    }
  } catch (error: any) {
    console.error('Failed to create ChatKit session:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create ChatKit session',
    })
  }
})

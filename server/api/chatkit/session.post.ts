export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.openaiApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      message: 'OPENAI_API_KEY not configured',
    })
  }

  const workflowId = config.public.workflowId
  if (!workflowId) {
    throw createError({
      statusCode: 500,
      message: 'NUXT_PUBLIC_WORKFLOW_ID not configured',
    })
  }

  try {
    // Generate a simple user ID
    const userId = `user_${Date.now()}`

    // Make direct API call to OpenAI's ChatKit sessions endpoint (same as Next.js)
    const requestBody = {
      workflow: {
        id: workflowId,
      },
      user: userId,
    }

    console.log(
      'Creating ChatKit session with:',
      JSON.stringify(requestBody, null, 2)
    )

    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      let errorDetails
      try {
        errorDetails = JSON.parse(errorText)
      } catch {
        errorDetails = errorText
      }
      console.error('OpenAI API error details:', errorDetails)
      throw createError({
        statusCode: response.status,
        message: `OpenAI API error: ${response.statusText}`,
      })
    }

    const data = await response.json()
    console.log('ChatKit session response:', JSON.stringify(data, null, 2))
    console.log('ChatKit session created successfully:', {
      userId,
      workflowId,
      hasClientSecret: !!data.client_secret,
    })

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

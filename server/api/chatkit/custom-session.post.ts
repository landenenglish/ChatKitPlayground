import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Return a fake session that makes ChatKit use our custom backend
  const sessionId = `cksess_custom_${Date.now()}`
  const clientSecret = `ck_custom_${Date.now()}`

  return {
    client_secret: clientSecret,
    id: sessionId,
    object: 'chatkit.session',
    status: 'active',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    max_requests_per_1_minute: 100,
    workflow: {
      id: 'custom_workflow',
      version: null,
    },
    // Tell ChatKit to use our local backend
    api_base: `${event.node.req.headers.origin || 'http://localhost:3000'}/api/chatkit`,
  }
})


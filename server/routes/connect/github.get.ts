import { joinURL, withQuery } from 'ufo'
import { randomUUID } from 'uncrypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const state = randomUUID()
  setCookie(event, 'state', state)

  return await sendRedirect(
    event,
    withQuery('https://github.com/login/oauth/authorize', {
      client_id: config.github.clientId,
      redirect_uri: config.redirectUri,
      state
    })
  )
})

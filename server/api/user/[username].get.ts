import { GitHubService } from '~/services/githubServices'
import { formatUserResponse } from '~/utils/githubApiUtils'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const username = getRouterParam(event, 'username')

  if (!username || !username.match(/^[\w\-\d]+$/)) throw createError({ message: 'username is required' })

  const githubService = new GitHubService(config.github.token)

  try {
    const userData = await githubService.getUserData(username)
    const response = formatUserResponse(userData)

    if (!response.username) {
      throw createError({ statusCode: 400, message: 'Not enough data about this user.' })
    }

    return response
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }
    throw error
  }
})

import { GitHubService } from '~/services/githubServices'
import { formatUserResponse } from '~/utils/githubApiUtils'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const username = getRouterParam(event, 'username')

  if (!username || !username.match(/^[\w\-\d]+$/)) {
    throw createError({ message: 'Username is required' })
  }

  const githubService = new GitHubService(config.github.token)

  try {
    // Fetch GitHub user data
    const userData = await githubService.getUserData(username)
    const response = formatUserResponse(userData)

    if (!response.username) {
      throw createError({ statusCode: 400, message: 'Not enough data about this user.' })
    }

    // Create a prompt for the AI
    const prompt = `Write about the GitHub profile of ${response.username} and maybe provide insights into their coding style, notable contributions, and potential areas for improvement. Also, suggest collaboration opportunities based on their interests and skills. Keep the analysis concise and focused on key points. You must write it using HTML tags for formatting.`

    // Call the Together.ai API
    const req = await fetch('https://api.together.xyz/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.togetherApiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-ai/DeepSeek-V3', // Use DeepSeek model or another supported model
        prompt: prompt,
        // max_tokens: 500, // Limit the response length
        temperature: 0.6, // Control creativity
        top_p: 0.95,
        repetition_penalty: 0,
        stop: ['Human:', 'AI:'] // Stop sequences
      })
    })

    const res = await req.json()
    console.log('Raw API response:', res)
    console.log('This 1')

    if (!req.ok) {
      console.error('Together API error:', res)
      throw createError({
        statusCode: req.status,
        message: res.message || 'Together API error'
      })
    }

    // Extract the AI-generated text
    const text = (Array.isArray(res.output.choices) && res.output.choices[0]?.text) || ''

    if (!text) {
      console.error('Unexpected API response structure:', res)
      throw createError({
        statusCode: 500,
        message: 'Could not extract text from API response'
      })
    }

    const analysis = text.trim()

    // Add the AI analysis to the response
    return {
      ...response,
      analysis
    }
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }
    console.error('Error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch user data or generate analysis.'
    })
  }
})

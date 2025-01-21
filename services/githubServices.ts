import { UserSchema, ReposSchema } from '../utils/schemas/githubSchemas'

export class GitHubService {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json'
    }
  }

  async getUserData(username: string) {
    const [userResult, reposResult, eventsResult] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers: this.headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`, {
        headers: this.headers
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`, {
        headers: this.headers
      })
    ])

    if (userResult.status === 'rejected') {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return {
      user: UserSchema._parse(await userResult.value.json()).output,
      repos: reposResult.status === 'fulfilled' ? ReposSchema._parse(await reposResult.value.json()).output : [],
      events: eventsResult.status === 'fulfilled' ? await eventsResult.value.json() : []
    }
  }
}

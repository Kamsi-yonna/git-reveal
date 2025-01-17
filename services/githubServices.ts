import { UserSchema, ReposSchema, ResultsSchema } from '../utils/schemas/githubSchemas'

export class GitHubService {
  private token: string

  constructor(token: string) {
    this.token = token
  }

  async getUserData(username: string) {
    const headers = {
      Authorization: `Bearer ${this.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json'
    }

    const [userResult, reposResult, firstCommitResult, eventsResult, followersResult] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`, {
        headers
      }),
      fetch(`/search/commits?q=author:${encodeURIComponent(username)}&sort=committer-date&order=asc&per_page=1`, {
        headers
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`, { headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/followers?per_page=100`, { headers })
    ])

    if (userResult.status === 'rejected') {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return {
      user: UserSchema._parse(await userResult.value.json()).output,
      repos: reposResult.status === 'fulfilled' ? ReposSchema._parse(await reposResult.value.json()).output : [],
      firstCommit:
        firstCommitResult.status === 'fulfilled'
          ? ResultsSchema._parse(await firstCommitResult.value.json()).output?.items[0]
          : null,
      events: eventsResult.status === 'fulfilled' ? await eventsResult.value.json() : [],
      followers: followersResult.status === 'fulfilled' ? await followersResult.value.json() : []
    }
  }
}

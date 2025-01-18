import { UserSchema, ReposSchema, ResultsSchema } from '../utils/schemas/githubSchemas'

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

  async getLatestCommit(username: string) {
    const response = await fetch(
      `https://api.github.com/search/commits?q=author:${encodeURIComponent(
        username
      )}&sort=committer-date&order=desc&per_page=1`,
      { headers: this.headers }
    )
    const data = await response.json()
    return ResultsSchema._parse(data).output?.items[0] || null
  }

  async getPinnedRepositories(username: string) {
    // GitHub's GraphQL API query for pinned repositories
    const query = `
      query {
        user(login: "${username}") {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                description
                url
                stargazerCount
                forkCount
                primaryLanguage {
                  name
                  color
                }
            }
          }
        }
      }
    }`

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        ...this.headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    })

    const data = await response.json()
    return data.data?.user?.pinnedItems?.nodes || []
  }

  async getUserLanguages(username: string) {
    // First get all repositories
    const repos = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100`, {
      headers: this.headers
    }).then((res) => res.json())

    // Create a map to store language stats
    const languageStats = new Map()

    // Fetch languages for each repository
    await Promise.all(
      repos.map(async (repo: any) => {
        if (repo.languages_url) {
          const languages = await fetch(repo.languages_url, {
            headers: this.headers
          }).then((res) => res.json())

          // Add bytes of each language to our stats
          Object.entries(languages).forEach(([language, bytes]: [string, any]) => {
            languageStats.set(language, (languageStats.get(language) || 0) + bytes)
          })
        }
      })
    )

    // Convert to array and sort by bytes
    return Array.from(languageStats.entries())
      .map(([language, bytes]) => ({
        language,
        bytes: bytes as number
      }))
      .sort((a, b) => b.bytes - a.bytes)
  }

  async getUserData(username: string) {
    const [
      userResult,
      reposResult,
      latestCommitResult,
      eventsResult,
      followersResult,
      pinnedReposResult,
      languagesResult
    ] = await Promise.allSettled([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers: this.headers }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`, {
        headers: this.headers
      }),
      this.getLatestCommit(username),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=30`, {
        headers: this.headers
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/followers?per_page=100`, {
        headers: this.headers
      }),
      this.getPinnedRepositories(username),
      this.getUserLanguages(username)
    ])

    if (userResult.status === 'rejected') {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return {
      user: UserSchema._parse(await userResult.value.json()).output,
      repos: reposResult.status === 'fulfilled' ? ReposSchema._parse(await reposResult.value.json()).output : [],
      latestCommit: latestCommitResult.status === 'fulfilled' ? latestCommitResult.value : null,
      events: eventsResult.status === 'fulfilled' ? await eventsResult.value.json() : [],
      followers: followersResult.status === 'fulfilled' ? await followersResult.value.json() : [],
      pinnedRepos: pinnedReposResult.status === 'fulfilled' ? pinnedReposResult.value : [],
      languages: languagesResult.status === 'fulfilled' ? languagesResult.value : []
    }
  }
}

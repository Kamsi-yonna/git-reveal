export interface GitHubUser {
  username: string
  avatar: string
  activityMetrics: {
    totalContributions: number
    currentStreak: {
      count: number
      startDate: string
      endDate: string
    }
    longestStreak: {
      count: number
      startDate: string
      endDate: string
    }
    recentEvents: {
      type: string
      repo: string
      created_at: string
      payload: {
        commits: {
          message: string
        }[]
      }
    }[]
  }
  repositoryStats: {
    popularRepositories: {
      name: string
      stars: number
      description: any
      url: string
    }[]
    primaryLanguages: {
      language: string
      count: number
    }[]
  }
  latestCommit: {
    html_url: string
    commit: {
      message: string
      author: {
        date: string
      }
    }
    repository: {
      full_name: string
      owner: {
        avatar_url: string
      }
    }
  }
  pinnedRepos: {
    name: string
    description: string
    url: string
    stargazerCount: number
    forkCount: number
    primaryLanguage: {
      name: string
      color: string
    }
  }[]
  languages: {
    language: string
    bytes: number
  }[]
}

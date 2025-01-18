import * as v from 'valibot'

export interface GitHubUser {
  username: string
  avatar: string
  activityMetrics: {
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

export const ContributionStatsSchema = v.object({
  total_contributions: v.number(),
  weeks: v.array(
    v.object({
      w: v.string(),
      c: v.number()
    })
  )
})

export const ActivitySchema = v.object({
  total_count: v.number(),
  items: v.array(
    v.object({
      type: v.string(),
      created_at: v.string(),
      repo: v.object({
        name: v.string(),
        url: v.string()
      })
    })
  )
})

export const LanguageStatsSchema = v.record(v.string(), v.number())

export const UserSchema = v.object({
  login: v.string(),
  name: v.string(),
  html_url: v.string(),
  avatar_url: v.string(),
  bio: v.nullish(v.string()),
  location: v.nullish(v.string()),
  company: v.nullish(v.string()),
  followers: v.number(),
  following: v.number(),
  public_repos: v.number(),
  public_gists: v.number(),
  created_at: v.string(),
  updated_at: v.string(),
  twitter_username: v.nullish(v.string()),
  blog: v.nullish(v.string()),
  email: v.nullish(v.string())
})

export const ReposSchema = v.array(
  v.object({
    id: v.number(),
    name: v.string(),
    full_name: v.string(),
    html_url: v.string(),
    description: v.nullish(v.string()),
    language: v.nullish(v.string()),
    stargazers_count: v.number(),
    forks_count: v.number(),
    watchers_count: v.number(),
    created_at: v.string(),
    updated_at: v.string(),
    owner: v.object({
      login: v.string(),
      avatar_url: v.string()
    })
  })
)

export const ResultsSchema = v.object({
  total_count: v.number(),
  items: v.array(
    v.object({
      html_url: v.string(),
      repository: v.object({
        full_name: v.string(),
        html_url: v.string(),
        owner: v.object({
          avatar_url: v.string(),
          login: v.string()
        })
      }),
      commit: v.object({
        message: v.string(),
        author: v.object({
          date: v.string(),
          name: v.string(),
          email: v.string()
        })
      }),
      author: v.object({
        login: v.string(),
        avatar_url: v.string(),
        html_url: v.string()
      })
    })
  )
})

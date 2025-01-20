import * as v from 'valibot'

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

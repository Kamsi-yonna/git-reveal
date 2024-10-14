import * as v from 'valibot'
import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig()
  const username = getRouterParam(event, 'username')
  if (!username || !username.match(/^[\w\-\d]+$/)) throw createError({ message: 'username is required' })

  const $gh = $fetch.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `Bearer ${config.github.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json'
    }
  })

  // Fetch user details and their repositories
  const [user, repos, results] = await Promise.allSettled([
    $gh(`/users/${encodeURIComponent(username)}`),
    $gh(`/users/${encodeURIComponent(username)}/repos`, {
      query: {
        sort: 'created',
        per_page: 100
      }
    }),
    $gh('/search/commits', {
      query: {
        q: `author:${encodeURIComponent(username)}`,
        order: 'asc',
        sort: 'committer-date',
        per_page: 1
      }
    })
  ])

  if (user.status === 'rejected') {
    throw createError({ statusCode: 404, message: 'user not found' })
  }

  if (results.status === 'rejected') {
    throw createError({ statusCode: 500, message: 'github api error' })
  }

  const parsedUser = UserSchema._parse(user.value).output
  const commit = ResultsSchema._parse(results.value).output?.items[0]

    if (!commit) {
      // @ts-expect-error unknown
      if (results?.total_count) {
        console.log(JSON.stringify(ResultsSchema._parse(results).issues))
      }
      throw createError({ statusCode: 404, message: 'no commits to show' })
    }

  // Prepare the response object
  const response = {
    username: parsedUser?.login,
    author: parsedUser?.name,
    authorUrl: parsedUser?.html_url,
    bio: parsedUser?.bio,
    location: parsedUser?.location,
    organization: parsedUser?.company,
    avatar: parsedUser?.avatar_url,
    repositories: repos.status === 'fulfilled' ? ReposSchema._parse(repos.value).output : [],
    firstCommit: commit
      ? {
          date: commit.commit.author.date,
          link: commit.html_url,
          message: commit.commit.message,
          authorUrl: commit.author.html_url,
          authorName: commit.commit.author.name,
          repositoryName: commit.repository.full_name,
          repositoryOwnerAvatar: commit.repository.owner.avatar_url
        }
      : null
  }

  return response
})

// Define schemas for validation
const ResultsSchema = v.object({
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

const UserSchema = v.object({
  login: v.string(),
  name: v.string(),
  html_url: v.string(),
  avatar_url: v.string(),
  bio: v.nullish(v.string()), // Allow for null or undefined
  location: v.nullish(v.string()), // Allow for null or undefined
  company: v.nullish(v.string()) // Allow for null or undefined
})

const ReposSchema = v.array(
  v.object({
    id: v.number(),
    name: v.string(),
    full_name: v.string(),
    html_url: v.string(),
    description: v.nullish(v.string()),
    owner: v.object({
      login: v.string(),
      avatar_url: v.string()
    })
  })
)

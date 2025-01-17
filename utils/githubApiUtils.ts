interface Repository {
  name: string
  stargazers_count: number
  description: string
  html_url: string
}

interface Event {
  type: string // Adjust the type based on your actual data structure
  created_at: string // ISO date string
  repo: {
    name: string
  }
  payload: any // You can define a more specific type if known
}

export function calculateRepoStats(repos: any[]) {
  return repos.reduce(
    (stats, repo) => ({
      totalStars: stats.totalStars + (repo.stargazers_count || 0),
      totalForks: stats.totalForks + (repo.forks_count || 0),
      languages: {
        ...stats.languages,
        [repo.language || 'Unknown']: (stats.languages[repo.language || 'Unknown'] || 0) + 1
      }
    }),
    { totalStars: 0, totalForks: 0, languages: {} }
  )
}

export function formatUserResponse(userData: any) {
  const { user, repos, firstCommit, events } = userData
  const repoStats = calculateRepoStats(repos)
  return {
    username: user?.login,
    author: user?.name,
    authorUrl: user?.html_url,
    bio: user?.bio,
    location: user?.location,
    organization: user?.company,
    avatar: user?.avatar_url,

    socials: {
      twitter: user?.twitter_username,
      blog: user?.blog,
      email: user?.email
    },

    repositoryStats: {
      totalRepositories: repos.length,
      totalStars: repoStats.totalStars,
      totalForks: repoStats.totalForks,
      primaryLanguages: Object.entries(repoStats.languages)
        .sort(([langA, countA], [langB, countB]) => (countB as number) - (countA as number))
        .slice(0, 5)
        .map(([lang, count]) => ({ language: lang, count })),

      popularRepositories: repos
        .sort((a: Repository, b: Repository) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 5)
        .map((repo: Repository) => ({
          name: repo.name,
          stars: repo.stargazers_count,
          description: repo.description,
          url: repo.html_url
        }))
    },

    activityMetrics: {
      recentEvents: events.slice(0, 10).map((event: Event) => ({
        type: event.type,
        created_at: event.created_at,
        repo: event.repo.name,
        payload: event.payload
      })),
      followerCount: user?.followers,
      followingCount: user?.following,
      publicGists: user?.public_gists,
      accountCreated: user?.created_at,
      lastUpdated: user?.updated_at
    },

    firstContribution: firstCommit
      ? {
          date: firstCommit.commit.author.date,
          link: firstCommit.html_url,
          message: firstCommit.commit.message,
          repository: firstCommit.repository.full_name
        }
      : null
  }
}

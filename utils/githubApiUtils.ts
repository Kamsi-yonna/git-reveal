interface Repository {
  name: string
  stargazers_count: number
  description: string
  html_url: string
}

interface Event {
  type: string
  created_at: string
  repo: {
    name: string
  }
  payload: any
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
    avatar: user?.avatar_url,

    repositoryStats: {
      totalRepositories: repos.length,
      totalStars: repoStats.totalStars,
      totalForks: repoStats.totalForks,
      primaryLanguages: Object.entries(repoStats.languages)
        .sort(([langA, countA], [langB, countB]) => (countB as number) - (countA as number))
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
      recentEvents: events.slice(0, 6).map((event: Event) => ({
        type: event.type,
        created_at: event.created_at,
        repo: event.repo.name,
        payload: event.payload
      })),
      lastUpdated: user?.updated_at,
      followerCount: user?.followers,
      followingCount: user?.following
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

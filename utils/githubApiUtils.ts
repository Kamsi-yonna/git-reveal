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

// export function calculateCurrentStreak(events: Event[]): number {
//   if (!events.length) return 0

//   //sort events in desc order
//   const sortedEvents = [...events].sort(
//     (a: Event, b: Event) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//   )

//   let currentStreak = 0
//   let lastDate = new Date(sortedEvents[0].created_at)
//   let today = new Date()
//   today.setHours(0, 0, 0, 0)
//   lastDate.setHours(0, 0, 0, 0)

//   if ((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24) > 1) {
//     return 0
//   }

//   const consecutiveDates = new Set<string>()

//   for (const event of sortedEvents) {
//     const eventDate = new Date(event.created_at)
//     eventDate.setHours(0, 0, 0, 0)
//     const dateString = eventDate.toISOString().split('T')[0]

//     if (consecutiveDates.has(dateString)) continue

//     const daysDifference = (lastDate.getTime() - eventDate.getTime()) / (1000 ** 60 * 60 * 24)

//     if (daysDifference <= 1) {
//       currentStreak++
//       lastDate = eventDate
//       consecutiveDates.add(dateString)
//     } else {
//       break
//     }
//   }
//   return currentStreak
// }

// export function calculateCurrentStreak(events: Event[]): number {
//   if (!events.length) return 0

//   // Sort events in descending order by date
//   const sortedEvents = [...events].sort(
//     (a: Event, b: Event) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//   )

//   // Get today's date at midnight UTC
//   const today = new Date()
//   today.setUTCHours(0, 0, 0, 0)

//   // Get most recent event date at midnight UTC
//   const mostRecentDate = new Date(sortedEvents[0].created_at)
//   mostRecentDate.setUTCHours(0, 0, 0, 0)

//   // If no activity today or yesterday, streak is 0
//   const daysSinceLastActivity = Math.floor((today.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60 * 24))
//   if (daysSinceLastActivity > 1) {
//     return 0
//   }

//   let currentStreak = 1 // Count the most recent day
//   const processedDates = new Set<string>()
//   processedDates.add(mostRecentDate.toISOString().split('T')[0])

//   let previousDate = mostRecentDate

//   // Loop through events to find consecutive days
//   for (let i = 1; i < sortedEvents.length; i++) {
//     const eventDate = new Date(sortedEvents[i].created_at)
//     eventDate.setUTCHours(0, 0, 0, 0)
//     const dateString = eventDate.toISOString().split('T')[0]

//     // Skip if we already counted this date
//     if (processedDates.has(dateString)) continue

//     // Calculate days between current event and previous date
//     const daysDifference = Math.floor((previousDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24))

//     if (daysDifference === 1) {
//       // Consecutive day found
//       currentStreak++
//       previousDate = eventDate
//       processedDates.add(dateString)
//     } else if (daysDifference === 0) {
//       // Same day activity, continue checking
//       continue
//     } else {
//       // Break in the streak
//       break
//     }
//   }

//   return currentStreak
// }

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
      // currentStreaks: calculateCurrentStreak(events)
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

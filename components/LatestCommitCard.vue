<template>
    <main
        class="p-2 md:p-4 gap-2 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md cursor-default">
        <h2 class="text-lg font-semibold mb-2">Latest Commit</h2>
        <div v-if="gitUser" class="block p-2.5 w-full text-sm rounded-lg border border-gray-300">
            <div v-if="latestPushEvent" class="flex items-start justify-between gap-4">
                <div class="flex flex-col gap-2 max-w-[60%]">
                    <div class="flex items-center gap-2">
                        <img class="rounded-full h-4 w-4" :src="props.gitUser.avatar" :alt="props.gitUser.username" />
                        <span>{{ latestPushEvent.type }}</span>
                    </div>
                    <span class="text-sm line-clamp-2">
                        {{ latestPushEvent.repo }}
                    </span>
                    <span class="text-sm text-gray-600 line-clamp-2">
                        {{ latestPushEvent.payload.commits[0]?.message || 'No commit message' }}
                    </span>
                </div>

                <div class="flex flex-col gap-4 justify-between items-end">
                    <span class="text-sm text-gray-500">
                        {{ new Date(latestPushEvent.created_at).toLocaleDateString() }}
                    </span>

                    <NuxtLink
                        class="rounded flex-shrink-0 bg-black text-white text-sm shadow px-3 py-2 flex flex-row gap-1 items-center border border-black hover:bg-white hover:text-black"
                        :href="`https://github.com/${latestPushEvent.repo}`" target="_blank" rel="noopener noreferrer">
                        <Icon name="ic:outline-arrow-outward" class="text-lg" />
                        Visit Repo
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div v-else class="p-4 md:p-8 shadow-md w-full mx-auto border-[1px] border-red-400 rounded-md">
            <p class="text-red-600 text-sm">Oops! Can't access this user's latest commit</p>
            <p class="text-red-500 text-sm">
                <small>Please try entering a different username.</small>
            </p>
        </div>

    </main>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { GitHubUser } from '~/utils/schemas/githubSchemas';

const props = defineProps<{
    gitUser: GitHubUser;
}>();

// Computed property to find the latest PushEvent
const latestPushEvent = computed(() => {
    const recentEvents = props.gitUser.activityMetrics?.recentEvents || [];
    return recentEvents.find(event => event.type === 'PushEvent') || null;
});
</script>

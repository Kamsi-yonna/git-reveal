// components/PinnedRepoCard.vue
<template>
    <main class="p-2 md:p-4 gap-2 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md">

        <h2 class="text-lg font-semibold mb-4">Popular Repositories</h2>

        <div v-if="topReposiroties" class="grid gap-4">
            <div v-for="repo in topReposiroties" :key="repo.name" class="p-4 border rounded-lg">
                <div class="flex items-end justify-between gap-4">
                    <div class="flex flex-col gap-2 max-w-[60%]">
                        <div class="flex items-center gap-2">
                            <img class="rounded-full h-4 w-4" :src="props.gitUser.avatar"
                                :alt="props.gitUser.username" />
                            <span>{{ repo.name }}</span>
                        </div>
                        <span class="text-sm line-clamp-2">
                            {{ repo.description }}
                        </span>
                    </div>

                    <NuxtLink
                        class="rounded flex-shrink-0 bg-black text-white text-sm shadow px-3 py-2 flex flex-row gap-1 items-center border border-black hover:bg-white hover:text-black"
                        :href="repo.url" target="_blank" rel="noopener noreferrer">
                        <Icon name="ic:outline-arrow-outward" class="text-lg" />
                        Visit Repo
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4">
            No pinned repositories found
        </div>
    </main>
</template>

<script setup lang="ts">
import type { GitHubUser } from '~/types/user';

const props = defineProps<{
    gitUser: GitHubUser;
}>();

const topReposiroties = props.gitUser.repositoryStats.popularRepositories

</script>

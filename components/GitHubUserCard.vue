<template>
    <main
        class="p-4 md:p-8 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md transition-[padding] ease-out">
        <header class="relative flex  items-center gap-4 justify-between">
            <!-- Profile picture and username -->
            <div class="flex flex-row gap-4 items-center">
                <img class="rounded-full h-16 w-16" :src="gitUser.avatar" :alt="`Avatar for ${gitUser.username}`" />

                <NuxtLink class="flex flex-col gap-2" :to="gitUser.authorUrl" target="_blank" rel="noopener noreferrer">
                    <span class="leading-none text-lg font-cal font-semibold">
                        {{ gitUser.author || gitUser.username }}
                    </span>
                    <span class="leading-none opacity-50 text-sm">
                        @{{ gitUser.username }}
                    </span>
                </NuxtLink>
            </div>

            <!-- user stats  -->
            <div class="flex flex-row gap-2 items-center">
                <div class="flex flex-row gap-4">
                    <div class="flex flex-col items-start">
                        <span class="text-sm font-medium">{{ gitUser.repositoryStats?.totalRepositories || 0
                            }}</span>
                        <span class="text-xs text-gray-600">Repos</span>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="text-sm font-medium">{{ gitUser.activityMetrics?.followerCount || 0 }}</span>
                        <span class="text-xs text-gray-600">Followers</span>
                    </div>
                    <div class="flex flex-col items-start">
                        <span class="text-sm font-medium">{{ gitUser.repositoryStats?.totalStars || 0 }}</span>
                        <span class="text-xs text-gray-600">Stars</span>
                    </div>
                </div>
            </div>
        </header>

        <hr class="my-4" />
        <!-- user bio -->
        <div class="flex items-center justify-between gap-4">
            <span class="text-xs">
                <span class="flex flex-row gap-2 items-center">
                    <span v-if="gitUser.bio" class="leading-none opacity-50 text-sm">
                        {{ gitUser.bio }}
                    </span>
                </span>
            </span>
        </div>

        <!-- First Commit Section - Only show if firstCommit exists -->
        <div v-if="gitUser.firstCommit" class="flex items-center justify-between gap-4">
            <NuxtLink class="flex flex-col gap-2 line-clamp-1" :href="gitUser.firstCommit.link" target="_blank"
                rel="noopener noreferrer">
                <span class="line-clamp-1">
                    {{ gitUser.firstCommit.message }}
                </span>
                <span class="text-xs">
                    <span class="flex flex-row gap-2 items-center">
                        <img v-if="gitUser.firstCommit.repositoryOwnerAvatar" class="rounded-full h-4 w-4"
                            :src="gitUser.firstCommit.repositoryOwnerAvatar" :alt="`Repository owner avatar`" />
                        <span>{{ gitUser.firstCommit.repositoryName }}</span>
                    </span>
                </span>
            </NuxtLink>

           
        </div>
    </main>
</template>

<script setup lang="ts">
defineProps(['gitUser']);


</script>

<style lang="scss" scoped></style>
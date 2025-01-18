<template>
    <main
        class="p-2 md:p-4 gap-2 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md transition-[padding] ease-out">
        <span class="line-clamp-1">Latest commit</span>
        <div class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 overflow-auto">
            <div class="flex items-center justify-between gap-4">
                <a class="flex flex-col gap-2 line-clamp-1"
                    href="https://github.com/danielroe/trellis-valet-driver/commit/a664e13824f80866e45529c349394ea26bb987d6"
                    rel="noopener noreferrer">
                    <span class="text-sm">
                        <span class="flex flex-row gap-2 items-center">
                            <img class="rounded-full h-4 w-4" src="https://avatars.githubusercontent.com/u/28706372?v=4"
                                alt="Avatar for danielroe" />
                            <span>danielroe/trellis-valet-driver</span>
                        </span>
                    </span>
                </a>

                <button
                    class="rounded flex-shrink-0 bg-black text-white text-sm shadow px-3 py-2 flex flex-row gap-2 items-center border border-black hover:bg-white hover:text-black"
                    href="https://twitter.com/intent/tweet?text=Check%20out%20danielroe's%20first%20commit%20on%20GitHub.%0A%0Ahttps%3A%2F%2Ffirstcommit.is%2Fdanielroe">
                    <Icon name="tabler:share" />
                    Share
                </button>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { GitHubUser } from '~/utils/schemas/githubSchemas'

const props = defineProps<{
    gitUser: GitHubUser
    currentFilter: string
}>()
</script>

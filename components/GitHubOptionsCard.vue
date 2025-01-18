<template>
    <main
        class="p-2 md:p-4 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md transition-[padding] ease-out">

        <span v-if="currentFilter === 'Latest Commit'"
            class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 overflow-auto">
            Latest commit content goes here...
        </span>

        <span v-if="currentFilter === 'Pinned Repositories'"
            class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 overflow-auto">
            Pinned Repositories content goes here...
        </span>

        <span v-if="currentFilter === 'Hottest Repository'"
            class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 overflow-auto">
            Hottest Repository content goes here...
        </span>

        <span v-if="currentFilter === 'Contributions Streak'"
            class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 overflow-auto">
            Contribution streak content goes here...
        </span>

        <span v-if="currentFilter === 'Primary Languages'"
            class="block p-2.5 w-full text-sm rounded-lg border border-gray-300 overflow-auto">
            Primary Languages content goes here...
        </span>

    </main>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { GitHubUser } from '~/utils/schemas/githubSchemas';

const props = defineProps<{
    gitUser: GitHubUser;
    currentFilter: string;
}>();
</script>

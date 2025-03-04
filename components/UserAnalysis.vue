<template>
    <main
        class="p-2 md:p-4 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md transition-[padding] ease-out">

        <span rows="4" class="block p-2.5 w-full text-sm  rounded-lg border border-gray-300  overflow-auto"
            placeholder="Write your thoughts here..."> {{ analysis }}
        </span>
    </main>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import type { GitHubUser } from '~/types/user';

// Define props
const props = defineProps<{
    gitUser: GitHubUser | null;
    analysis: string;
}>();
</script>

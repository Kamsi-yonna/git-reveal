<template>
    <main class="p-2 md:p-4 gap-2 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md">
        <h2 class="text-lg font-semibold mb-4">User's top stacks</h2>

        <div class="grid gap-2">
            <div class="flex flex-wrap flex-row gap-2 items-start max-w-[500px] ">
                <UTooltip v-for="lang in filteredLanguages" :key="lang.language"
                    class="rounded flex-shrink-0 bg-grey-400 border border-black hover:bg-gray-700 hover:text-white text-sm shadow px-3 py-2 flex flex-row gap-2 items-center cursor-default"
                    :text="lang.language">
                    <span class="text-md">
                        {{ lang.language }}
                    </span>
                    <i
                        :class="`devicon-${lang.language in languageMapping ? languageMapping[lang.language] : lang.language.toLowerCase()}-plain`"></i>
                </UTooltip>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { GitHubUser } from '~/types/user';

const props = defineProps<{
    gitUser: GitHubUser;
    currentFilter: string;
}>();

const languageMapping: Record<string, string> = {
    'Vue': 'vuejs',
    'JavaScript': 'javascript',
    'Java': 'java',
    'C++': 'cplusplus',
    'C#': 'csharp',
    'HTML': 'html5',
    'CSS': 'css3',
    'Rust': 'rust',
    'React': 'react',
    'Angular': 'angularjs',
    'Node.js': 'nodejs',
};

const filteredLanguages = computed(() => {
    return props.gitUser.repositoryStats.primaryLanguages.filter(
        lang => lang.language.toLowerCase() !== 'unknown'
    );
});

const stack = props.gitUser.repositoryStats.primaryLanguages;
</script>

<style scoped>
.devicon {
    width: 10px;
    height: 20px;
}
</style>
<template>
    <div class="min-h-[100svh] flex-grow flex flex-col justify-center p-2 gap-6">
        <nav class="flex flex-row gap-2 justify-center max-w-[500px] w-full mx-auto">
            <NuxtLink
                class="rounded flex-shrink-0 bg-black text-white text-sm shadow px-3 py-2 flex flex-row gap-2 items-center"
                href="/connect/github" external>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor"
                        d="M12.001 2c-5.525 0-10 4.475-10 10a9.994 9.994 0 0 0 6.837 9.488c.5.087.688-.213.688-.476c0-.237-.013-1.024-.013-1.862c-2.512.463-3.162-.612-3.362-1.175c-.113-.288-.6-1.175-1.025-1.413c-.35-.187-.85-.65-.013-.662c.788-.013 1.35.725 1.538 1.025c.9 1.512 2.337 1.087 2.912.825c.088-.65.35-1.087.638-1.337c-2.225-.25-4.55-1.113-4.55-4.938c0-1.088.387-1.987 1.025-2.688c-.1-.25-.45-1.275.1-2.65c0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337c1.913-1.3 2.75-1.024 2.75-1.024c.55 1.375.2 2.4.1 2.65c.637.7 1.025 1.587 1.025 2.687c0 3.838-2.337 4.688-4.563 4.938c.363.312.676.912.676 1.85c0 1.337-.013 2.412-.013 2.75c0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10Z" />
                </svg>
                Find yours
            </NuxtLink>
            <UserNameForm v-model="newUsername" :placeholder="username" density="compact" @submit="openUser" />
        </nav>

        <!-- Error Display -->
        <main v-if="errorMessage"
            class="p-4 md:p-8 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-red-400 rounded-md">
            <p class="text-red-600 text-sm">Oops! {{ errorMessage.toLowerCase() }}</p>
            <p class="text-red-500 text-sm">
                <small>Please try entering a different username.</small>
            </p>
        </main>

        <GitHubUserCard v-else-if="gitUser" :gitUser="gitUser" />

        <!-- Analysis Section -->

        <nav v-if="gitUser" class="flex flex-wrap flex-row gap-2 items-start max-w-[500px] mx-auto">
            <button v-for="(button, index) in gitHubActions" :key="index"
                class="rounded flex-shrink-0 bg-grey-400 border border-black hover:bg-red-500 hover:text-white active:bg-red-500 text-sm shadow px-3 py-2 flex flex-row gap-2 items-center"
                :class="{ 'bg-red-500 text-white': currentFilter === button.label, 'bg-grey-400': currentFilter !== button.label }"
                @click="setFilter(button.label)">
                <Icon :name="button.icon" />
                {{ button.label }}
            </button>
        </nav>


        <nav v-if="isGeminiBtnVisible" class="flex flex-row gap-2 justify-center max-w-[500px] w-full mx-auto">
            <button
                class="rounded flex-shrink-0 bg-blue-500 text-white text-sm shadow px-3 py-2 flex flex-row gap-2 items-center border border-black hover:bg-rose-500 hover:text-white"
                @click="toggleUserAnalysis">
                <Icon name="ri:gemini-fill" />
                See what Gemini thinks about this user
            </button>
        </nav>

        <main>
            <UserAnalysis v-if="userAnalysis" :gitUser="gitUser!" />
            <GitHubOptionsCard v-if="!userAnalysis" :gitUser="gitUser!" :currentFilter="currentFilter" />
        </main>
    </div>
</template>

<script setup lang="ts">
import UserAnalysis from '~/components/UserAnalysis.vue';
import type { GitHubUser } from '~/utils/schemas/githubSchemas'

definePageMeta({
    alias: ["/user/:username"],
    middleware: (to) => {
        if (to.path !== to.path.toLowerCase()) {
            return to.path.toLowerCase();
        }
    },
});

const route = useRoute();
const username = route.params.username as string;
const newUsername = ref("");

const props = defineProps<{
    gitUser: GitHubUser;
}>();

// State variables
const userAnalysis = ref(false);
const currentFilter = ref('Latest Commit');
const isGeminiBtnVisible = ref(true);

function setFilter(filter: string) {
    currentFilter.value = filter;
    userAnalysis.value = false
    isGeminiBtnVisible.value = true
}

// Function to toggle User Analysis visibility
function toggleUserAnalysis() {
    userAnalysis.value = !userAnalysis.value;
    if (userAnalysis.value) {
        isGeminiBtnVisible.value = false;
        currentFilter.value = '';
    } else {
        isGeminiBtnVisible.value = true;
        currentFilter.value = 'Latest Commit';
    }
}

const gitHubActions = [
    { icon: 'uim:favorite', label: 'Latest Commit' },
    { icon: 'tabler:pinned-filled', label: 'Pinned Repositories' },
    { icon: 'ri:fire-fill', label: 'Hottest Repository' },
    { icon: 'material-symbols:timer', label: 'Contributions Streak' },
    { icon: 'ri:speak-ai-fill', label: 'Primary Languages' }
];

function openUser() {
    navigateTo(`/${newUsername.value.toLowerCase()}`);
}

const { data: gitUser, error } = await useFetch<GitHubUser>(`/api/user/${username}`, {
    lazy: true,
});

const message = computed(() => {
    if (user.value === username) {
        return `Check me out on GitHub!`;
    }
    return `Check out ${username}'s GitHub.`;
});

const errorMessage = computed(() => {
    if (error.value) {
        return error.value.data?.message || "An error occurred";
    }
    return;
});

const user = useCookie("github-user");

useSeoMeta({
    title: "Git-reveal - @" + username,
});

useServerSeoMeta({
    ogTitle: "Git-reveal - @" + username,
    twitterTitle: "Git-reveal - @" + username,
    description: "" + username + " on GitHub",
    ogDescription: "" + username + " on GitHub",
    twitterCard: "summary_large_image",
});
</script>

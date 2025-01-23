<template>
    <main class="p-2 md:p-4 gap-2 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md">
        <h2 class="text-lg font-semibold mb-4">User's Contribution Streak</h2>

        <div class="grid gap-2">
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Total Contributions (Last Year):</span>
                    <span class="font-semibold">{{ props.gitUser.activityMetrics?.totalContributions || 0 }}</span>
                </div>

                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Current Streak:</span>
                    <div class="text-right">
                        <!-- <span class="font-semibold">{{ props.gitUser.activityMetrics?.currentStreaks || 0 }} days</span> -->
                    </div>
                </div>

                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Longest Streak:</span>
                    <div class="text-right">
                        <span class="font-semibold">{{ props.gitUser.activityMetrics?.longestStreak || 0 }} days</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import type { GitHubUser } from '~/types/user';

const props = defineProps<{
    gitUser: GitHubUser;
}>();

const streakPeriod = computed(() => {
    const formatDate = (date: string) => new Date(date).toLocaleDateString();

    return {
        current: props.gitUser.activityMetrics.currentStreak.startDate &&
            props.gitUser.activityMetrics.currentStreak.endDate
            ? `${formatDate(props.gitUser.activityMetrics.currentStreak.startDate)} - ${formatDate(props.gitUser.activityMetrics.currentStreak.endDate)}`
            : null,
        longest: props.gitUser.activityMetrics.longestStreak.startDate &&
            props.gitUser.activityMetrics.longestStreak.endDate
            ? `${formatDate(props.gitUser.activityMetrics.longestStreak.startDate)} - ${formatDate(props.gitUser.activityMetrics.longestStreak.endDate)}`
            : null
    };
});
</script>
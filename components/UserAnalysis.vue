<template>
    <main
        class="p-2 md:p-4 shadow-md max-w-[500px] w-full mx-auto border-[1px] border-gray-600 rounded-md transition-[padding] ease-out">

        <span rows="4"
            class="block p-2.5 w-full text-sm  rounded-lg border border-gray-300  overflow-auto"
            placeholder="Write your thoughts here...">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihilorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.orem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.orem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.orem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium.
            </span>
    </main>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps({
    gitUser: {
        type: Object,
        required: true,
    },
});
</script>
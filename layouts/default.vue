<template>
  <div class="min-h-[100svh] flex flex-col justify-stretch">

    <PageLoader v-if="isLoading" />
    <slot v-else />

    <footer class="mt-auto p-2 text-center text-sm opacity-75 hover:opacity-100">
      <a class="hover:underline" href="https://github.com/Kamsi-yonna/git-reveal">
        source
      </a>
      &middot;
      made with ❤️ by <a class="font-semibold hover:underline" href="https://github.com/Kamsi-yonna">
        @Kamsi-yonna
      </a>

      &middot;
      inspiration <a class="font-semibold hover:underline" href="https://x.com/danielcroe">
        @danielcroe
      </a>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';

const isLoading = ref(true);

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
});
</script>

<style scoped></style>

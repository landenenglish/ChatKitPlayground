<script setup lang="ts">
const { isDarkMode, toggleDarkMode } = useAppTheme()
</script>

<template>
  <button
    type="button"
    class="focus-visible:outline-hidden flex h-10 w-10 items-center justify-center rounded-full text-surface-900 transition-all hover:bg-surface-100 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 dark:text-surface-0 dark:hover:bg-surface-800 dark:focus-visible:ring-offset-surface-950"
    @click="toggleDarkMode"
  >
    <i
      :class="[
        'pi text-base',
        { 'pi-moon': isDarkMode, 'pi-sun': !isDarkMode },
      ]"
    />
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()
const apiRoutes = ['CountBookAPI', 'GetAllBookAPI']
const showHeader = computed(() => !apiRoutes.includes(String(route.name ?? '')))
</script>

<template>
  <div class="main-container">
    <header v-if="showHeader">
      <BHeader />
    </header>

    <main class="main-box">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.main-container {
  width: 100%;
}

.main-box {
  min-height: calc(100vh - 96px);
}
</style>

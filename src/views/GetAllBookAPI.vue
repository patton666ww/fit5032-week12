<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const loading = ref(true)
const functionUrl =
  import.meta.env.VITE_GET_ALL_BOOKS_URL ||
  'https://australia-southeast2-fit5032-e5a0e.cloudfunctions.net/getAllBooks'

const displayData = computed(() =>
  JSON.stringify(jsondata.value ?? { status: 'Loading books...' }, null, 2),
)

const getAllBookAPI = async () => {
  try {
    const response = await axios.get(functionUrl, { timeout: 15000 })
    jsondata.value = response.data
    return response.data
  } catch (error) {
    jsondata.value = {
      error: error.response?.data?.error || error.message || 'Unable to get all books.',
    }
    return jsondata.value
  } finally {
    loading.value = false
  }
}

onMounted(getAllBookAPI)
</script>

<template>
  <main class="api-page">
    <pre :aria-busy="loading">{{ displayData }}</pre>
  </main>
</template>

<style scoped>
.api-page {
  min-height: 100vh;
  padding: 2rem;
  background: #fff;
}

pre {
  width: min(100%, 960px);
  margin: 0 auto;
  color: #111827;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const jsondata = ref(null)
const loading = ref(true)
const functionUrl =
  import.meta.env.VITE_BOOK_COUNT_URL ||
  'https://australia-southeast2-fit5032-e5a0e.cloudfunctions.net/countBooks'

const displayData = computed(() =>
  JSON.stringify(jsondata.value ?? { status: 'Loading book count...' }, null, 2),
)

const getBookCountAPI = async () => {
  try {
    const response = await axios.get(functionUrl, { timeout: 15000 })
    jsondata.value = response.data
    return response.data
  } catch (error) {
    jsondata.value = {
      error: error.response?.data?.error || error.message || 'Unable to get the book count.',
    }
    return jsondata.value
  } finally {
    loading.value = false
  }
}

onMounted(getBookCountAPI)
</script>

<template>
  <main class="api-page">
    <pre :aria-busy="loading">{{ displayData }}</pre>
  </main>
</template>

<style scoped>
.api-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: #fff;
}

pre {
  margin: 0;
  color: #111827;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>

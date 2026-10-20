<script setup>
import { ref } from 'vue'
import axios from 'axios'

const count = ref(null)
const error = ref('')
const loading = ref(false)
const functionUrl =
  import.meta.env.VITE_BOOK_COUNT_URL ||
  'https://australia-southeast2-fit5032-e5a0e.cloudfunctions.net/countBooks'

const getBookCount = async () => {
  count.value = null
  error.value = ''
  loading.value = true

  try {
    if (!functionUrl) {
      throw new Error('The book counter is not connected yet. Please try again later.')
    }
    const response = await axios.get(functionUrl, { timeout: 15000 })
    const result = response.data.count
    if (!Number.isInteger(result) || result < 0) {
      throw new Error('The server returned an invalid book count.')
    }
    count.value = result
  } catch (err) {
    error.value = err.message || 'Unable to get the book count. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2 text-center">
        <h1>Book Counter</h1>
        <p class="text-muted mb-4">Get the total number of books in our library.</p>
        <button class="btn btn-primary" type="button" :disabled="loading" @click="getBookCount">
          {{ loading ? 'Loading...' : 'Get Book Count' }}
        </button>
        <div class="mt-4" aria-live="polite">
          <p v-if="count !== null" class="alert alert-success">Total number of books: {{ count }}</p>
          <p v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

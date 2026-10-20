<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Add Book</h1>
        <p class="text-center text-muted mb-4">
          Add a new book record to the Firestore books collection.
        </p>

        <form @submit.prevent="addBook">
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="isbn" class="form-label">ISBN</label>
              <input
                id="isbn"
                v-model.number="isbn"
                class="form-control"
                type="number"
                min="1"
                required
              >
            </div>

            <div class="col-sm-6">
              <label for="name" class="form-label">Name</label>
              <input id="name" v-model.trim="name" class="form-control" type="text" required>
            </div>
          </div>

          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <div class="text-center">
            <button class="btn btn-primary" type="submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Adding...' : 'Add Book' }}
            </button>
          </div>
        </form>

        <section v-if="submittedBook" class="card mt-4" aria-live="polite">
          <div class="card-body">
            <h2 class="h5">Latest added book</h2>
            <p class="small text-break">Document ID: {{ submittedBook.id }}</p>
            <p>Submitted name: <strong>{{ submittedBook.name }}</strong></p>
            <p>Submitted ISBN: {{ submittedBook.isbn }}</p>
            <template v-if="storedBook">
              <p>Current name in Firestore: <strong>{{ storedBook.name }}</strong></p>
              <p>Current ISBN in Firestore: {{ storedBook.isbn }}</p>
            </template>
            <p v-else class="text-muted">Waiting for the saved record...</p>
            <p class="small text-muted mb-0">Live Firestore values. The cloud function converts text to uppercase after creation.</p>
          </div>
        </section>

        <BookList ref="bookListRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import BookList from '../components/BookList.vue'

const isbn = ref(null)
const name = ref('')
const bookListRef = ref(null)
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const submittedBook = ref(null)
const storedBook = ref(null)
let stopWatching = null
onUnmounted(() => stopWatching?.())

const addBook = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!isbn.value || !name.value) {
    errorMessage.value = 'Please enter both ISBN and name.'
    return
  }

  isSubmitting.value = true

  try {
    const original = {
      isbn: Number(isbn.value),
      name: name.value,
    }
    const docRef = await addDoc(collection(db, 'books'), original)
    stopWatching?.()
    submittedBook.value = { id: docRef.id, ...original }
    storedBook.value = null
    stopWatching = onSnapshot(docRef, (snapshot) => {
      storedBook.value = snapshot.exists() ? snapshot.data() : null
      bookListRef.value?.fetchBooks()
    }, (error) => {
      errorMessage.value = `Unable to watch the saved book: ${error.message}`
    })

    successMessage.value = `Book added successfully. Document ID: ${docRef.id}`
    isbn.value = null
    name.value = ''
    await bookListRef.value?.fetchBooks()
  } catch (error) {
    errorMessage.value = error.message
    console.error('Error adding book:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

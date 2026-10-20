<template>
  <div class="mt-5">
    <h2 class="text-center">Books with ISBN &gt; 1000</h2>
    <p class="text-center text-muted">
      Results are ordered by ISBN and limited to five books.
    </p>

    <div class="text-center my-3">
      <button class="btn btn-outline-primary" type="button" @click="fetchBooks" :disabled="isLoading">
        {{ isLoading ? 'Loading...' : 'Refresh Books' }}
      </button>
    </div>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <p v-if="!isLoading && !books.length" class="text-center text-muted">
      No books found with ISBN greater than 1000.
    </p>

    <ul v-else class="list-group">
      <li v-for="book in books" :key="book.id" class="list-group-item">
        <div class="row g-2 align-items-center">
          <div class="col-md-3">
            <input
              v-model.number="book.isbn"
              class="form-control"
              type="number"
              min="1"
              aria-label="Book ISBN"
            >
          </div>
          <div class="col-md-5">
            <input v-model.trim="book.name" class="form-control" type="text" aria-label="Book name">
          </div>
          <div class="col-md-4 d-flex gap-2">
            <button class="btn btn-success flex-fill" type="button" @click="updateBook(book)">
              Update
            </button>
            <button class="btn btn-danger flex-fill" type="button" @click="deleteBook(book.id)">
              Delete
            </button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

const books = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const fetchBooks = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const q = query(collection(db, 'books'), where('isbn', '>', 1000), orderBy('isbn'), limit(5))
    const querySnapshot = await getDocs(q)

    books.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    errorMessage.value = error.message
    console.error('Error fetching books:', error)
  } finally {
    isLoading.value = false
  }
}

const updateBook = async (book) => {
  if (!book.isbn || !book.name) {
    errorMessage.value = 'Please keep both ISBN and name before updating.'
    return
  }

  try {
    await updateDoc(doc(db, 'books', book.id), {
      isbn: Number(book.isbn),
      name: book.name,
    })
    await fetchBooks()
  } catch (error) {
    errorMessage.value = error.message
    console.error('Error updating book:', error)
  }
}

const deleteBook = async (bookId) => {
  try {
    await deleteDoc(doc(db, 'books', bookId))
    await fetchBooks()
  } catch (error) {
    errorMessage.value = error.message
    console.error('Error deleting book:', error)
  }
}

onMounted(fetchBooks)

defineExpose({
  fetchBooks,
})
</script>

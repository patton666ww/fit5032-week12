<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1 class="text-center">Firebase Login</h1>
        <p class="text-center text-muted mb-4">
          Sign in with Firebase Authentication and choose a role.
        </p>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="login-email" class="form-label">Email</label>
            <input
              id="login-email"
              v-model="email"
              type="email"
              class="form-control"
              autocomplete="username"
            >
          </div>

          <div class="mb-3">
            <label for="login-password" class="form-label">Password</label>
            <input
              id="login-password"
              v-model="password"
              type="password"
              class="form-control"
              autocomplete="current-password"
            >
          </div>

          <div class="mb-3">
            <label for="login-role" class="form-label">Role</label>
            <select id="login-role" v-model="role" class="form-select">
              <option value="" disabled>Select role</option>
              <option value="admin">Admin</option>
              <option value="librarian">Librarian</option>
              <option value="member">Member</option>
            </select>
          </div>

          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>

        <div v-if="currentUser" class="card mt-4">
          <div class="card-body">
            <h2 class="h5">Current User</h2>
            <p class="mb-1"><strong>Email:</strong> {{ currentUser.email }}</p>
            <p class="mb-1"><strong>UID:</strong> {{ currentUser.uid }}</p>
            <p class="mb-0"><strong>Role:</strong> {{ currentRole || 'No role selected' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { currentRole, currentUser, login } from '../auth'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const role = ref('')
const errorMessage = ref('')

const handleLogin = async () => {
  if (!role.value) {
    errorMessage.value = 'Please choose a role before logging in.'
    return
  }

  try {
    await login({
      email: email.value,
      password: password.value,
      role: role.value,
    })
    router.push(route.query.redirect || '/about')
  } catch (error) {
    errorMessage.value = error.message
    console.error('Login failed:', error)
    router.push('/access-denied')
  }
}
</script>

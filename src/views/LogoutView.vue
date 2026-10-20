<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2 text-center">
        <h1>Logged Out</h1>
        <p class="lead text-muted">
          You have signed out of Firebase Authentication.
        </p>
        <div class="card text-start mt-4">
          <div class="card-body">
            <h2 class="h5">Current User</h2>
            <p class="mb-1">
              <strong>Email:</strong> {{ currentUser ? currentUser.email : 'No current user' }}
            </p>
            <p class="mb-1">
              <strong>UID:</strong> {{ currentUser ? currentUser.uid : 'No current user' }}
            </p>
            <p class="mb-0"><strong>Role:</strong> {{ currentRole || 'No role selected' }}</p>
          </div>
        </div>
        <router-link to="/login" class="btn btn-primary mt-4">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { currentRole, currentUser } from '../auth'

onMounted(() => {
  console.log('Logout page current user:', currentUser.value)
  console.log('Logout page current role:', currentRole.value || 'No role selected')
})
</script>

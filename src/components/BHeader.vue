<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active" aria-current="page">
            Home (Week 9)
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">About</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/add-book" class="nav-link" active-class="active">
            Add Book
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/getbookcount" class="nav-link" active-class="active">
            Get Book Count
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/WeatherCheck" class="nav-link" active-class="active">
            Get Weather
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/CountBookAPI" class="nav-link" active-class="active">
            Count Book API
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/GetAllBookAPI" class="nav-link" active-class="active">
            Get All Book API
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/FireRegister" class="nav-link" active-class="active">
            Firebase Register
          </router-link>
        </li>
        <li v-if="!isAuthenticated" class="nav-item">
          <router-link to="/FireLogin" class="nav-link" active-class="active">
            Firebase Login
          </router-link>
        </li>
        <li v-else class="nav-item d-flex align-items-center gap-2">
          <span class="navbar-text small text-muted">
            {{ currentUser.email }} · {{ currentRole || 'No role' }}
          </span>
          <button type="button" class="nav-link" @click="handleLogout">Logout</button>
        </li>
      </ul>
    </header>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { currentRole, currentUser, isAuthenticated, logout } from '../auth'

const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/logout')
}
</script>

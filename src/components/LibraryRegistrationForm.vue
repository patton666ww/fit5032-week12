<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">Week 8 Firebase Registration</h1>
        <p class="text-center text-muted mb-4">
          Create a Firebase Authentication account for the eFolio task.
        </p>
        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="username" class="form-label">Email</label>
              <input
                type="email"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.email"
              >
              <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
            </div>
            <div class="col-sm-6">
              <label for="role" class="form-label">Role</label>
              <select
                class="form-select"
                id="role"
                @blur="() => validateRole(true)"
                @change="() => validateRole(false)"
                v-model="formData.role"
              >
                <option value="" disabled>Select role</option>
                <option value="admin">Admin</option>
                <option value="librarian">Librarian</option>
                <option value="member">Member</option>
              </select>
              <div v-if="errors.role" class="text-danger">{{ errors.role }}</div>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
              >
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="col-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                @blur="() => validateConfirmPassword(true)"
                v-model="formData.confirmPassword"
              >
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="mb-3">
            <label for="displayName" class="form-label">Display name</label>
            <textarea
              class="form-control"
              id="displayName"
              rows="2"
              v-model="formData.displayName"
            ></textarea>
          </div>

          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <div class="text-center">
            <BaseButton
              label="Register"
              color="primary"
              size="medium"
              type="submit"
              class="me-2"
            />
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row mt-5" v-if="submittedUsers.length">
      <div class="col-md-10 offset-md-1">
        <DataTable
          :value="submittedUsers"
          tableStyle="min-width: 50rem"
          stripedRows
          paginator
          :rows="5"
        >
          <Column field="email" header="Email"></Column>
          <Column field="role" header="Role"></Column>
          <Column field="uid" header="Firebase UID"></Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'
import { register } from '../auth'

const formData = ref({
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  displayName: '',
})

const submittedUsers = ref([])
const successMessage = ref('')
const errorMessage = ref('')

const errors = ref({
  email: null,
  password: null,
  confirmPassword: null,
  role: null,
})

const validateName = (blur) => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateRole = (blur) => {
  if (!formData.value.role) {
    if (blur) errors.value.role = 'Please choose one role.'
  } else {
    errors.value.role = null
  }
}

const submitForm = async () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateRole(true)

  if (
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.role
  ) {
    try {
      const user = await register({
        email: formData.value.email,
        password: formData.value.password,
        role: formData.value.role,
      })
      submittedUsers.value.push({
        id: Date.now(),
        email: user.email,
        role: formData.value.role,
        uid: user.uid,
      })
      successMessage.value = `Registered ${user.email} as ${formData.value.role}. Check Firebase Authentication users.`
      errorMessage.value = ''
      clearForm(false)
    } catch (error) {
      successMessage.value = ''
      errorMessage.value = error.message
      console.error('Registration failed:', error)
    }
  }
}

const clearForm = (clearMessages = true) => {
  formData.value = {
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    displayName: '',
  }
  errors.value = {
    email: null,
    password: null,
    confirmPassword: null,
    role: null,
  }
  if (clearMessages) {
    successMessage.value = ''
    errorMessage.value = ''
  }
}
</script>

<style scoped>
:deep(.p-datatable) {
  font-size: 0.95rem;
}
</style>

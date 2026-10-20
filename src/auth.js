import { computed, ref } from 'vue'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from './firebase'

const currentUser = ref(null)
const currentRole = ref(localStorage.getItem('fit5032-week8-role') || '')
const isAuthReady = ref(false)
const isAuthenticated = computed(() => Boolean(currentUser.value))

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  isAuthReady.value = true
  console.log('Firebase current user:', user)
  console.log('Current role:', currentRole.value || 'No role selected')
})

const register = async ({ email, password, role }) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  currentRole.value = role
  localStorage.setItem('fit5032-week8-role', role)
  console.log('Registered user:', credential.user)
  console.log('Registered role:', role)
  return credential.user
}

const login = async ({ email, password, role }) => {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  currentRole.value = role
  localStorage.setItem('fit5032-week8-role', role)
  console.log('Signed in user:', credential.user)
  console.log('Signed in role:', role)
  return credential.user
}

const logout = async () => {
  await signOut(auth)
  currentRole.value = ''
  localStorage.removeItem('fit5032-week8-role')
  console.log('Firebase current user after logout:', auth.currentUser)
}

export { currentUser, currentRole, isAuthenticated, isAuthReady, login, logout, register }

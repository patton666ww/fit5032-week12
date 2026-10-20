import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBceNcvV0ZXlB4NRqWoMrYko3OFeYtF6Ts',
  authDomain: 'fit5032-e5a0e.firebaseapp.com',
  projectId: 'fit5032-e5a0e',
  storageBucket: 'fit5032-e5a0e.firebasestorage.app',
  messagingSenderId: '664326564661',
  appId: '1:664326564661:web:072bff2c610a596a3dba7c',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }

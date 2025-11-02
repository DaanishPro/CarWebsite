// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMfO6V5rq_pwUgDo43pLYPhsdVzOZXdXU",
  authDomain: "carshowroom-1cd14.firebaseapp.com",
  databaseURL: "https://carshowroom-1cd14-default-rtdb.firebaseio.com",
  projectId: "carshowroom-1cd14",
  storageBucket: "carshowroom-1cd14.firebasestorage.app",
  messagingSenderId: "422006110992",
  appId: "1:422006110992:web:2f663ffbdec654cb930395",
  measurementId: "G-DKJSFCH35L",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const realtimeDb = getDatabase(app)

export { app, auth, db, realtimeDb }

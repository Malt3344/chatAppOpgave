import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEosr_qzfsX-HGJvwK9DklEoxCRn7iadE",
  authDomain: "dip-users.firebaseapp.com",
  projectId: "dip-users",
  storageBucket: "dip-users.firebasestorage.app",
  messagingSenderId: "812034652918",
  appId: "1:812034652918:web:666b238f9ad3446341cad7"
};

// Initialize Firebase
const firebaseapp = initializeApp(firebaseConfig)
const dbRef = getFirestore(firebaseapp)


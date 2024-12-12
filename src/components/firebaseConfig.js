// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnQm3YwMddHPA_ODQo3WSk0iU6eL09wm0",
  authDomain: "spark-of-safety.firebaseapp.com",
  projectId: "spark-of-safety",
  storageBucket: "spark-of-safety.firebasestorage.app",
  messagingSenderId: "1011253492567",
  appId: "1:1011253492567:web:c63a618f480966c10ddc12",
  measurementId: "G-QT0XTZJ3FH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };
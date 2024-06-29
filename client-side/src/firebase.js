import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAf_h2jrj1ta8UbgEgSHouku_8An2uWBxY",
  authDomain: "authorization-a7fa3.firebaseapp.com",
  projectId: "authorization-a7fa3",
  storageBucket: "authorization-a7fa3.appspot.com",
  messagingSenderId: "969504232350",
  appId: "1:969504232350:web:f0be282f4932dc0102fc8f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };
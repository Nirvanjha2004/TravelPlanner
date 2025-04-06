import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDqb3m2wwnY2yNhZWzR6UDTnP-AI4I7gLg",
    authDomain: "vashisht-84542.firebaseapp.com",
    projectId: "vashisht-84542",
    storageBucket: "vashisht-84542.firebasestorage.app",
    messagingSenderId: "723317032655",
    appId: "1:723317032655:web:ef33ea3ce5fd5138f319ba",
    measurementId: "G-BDHJ1PW01Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Debug mode - remove in production
if (process.env.NODE_ENV === 'development') {
  console.log("Firebase initialized with project:", firebaseConfig.projectId);
}

export { auth, db };
export default app;

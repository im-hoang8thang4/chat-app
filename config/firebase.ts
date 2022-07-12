// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHKDfY3o8s1qNiEqq0wz1gAtakLgzRQcw",
    authDomain: "chat-app-clone-cafe4.firebaseapp.com",
    projectId: "chat-app-clone-cafe4",
    storageBucket: "chat-app-clone-cafe4.appspot.com",
    messagingSenderId: "794698018906",
    appId: "1:794698018906:web:38a28a913d28c1317ce863"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { db, auth, provider }
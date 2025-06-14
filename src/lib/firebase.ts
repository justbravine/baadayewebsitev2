import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDwKsUDeDc_ea8cCLe8UFi3nWNrQ1pWCu8",
  authDomain: "baadayewebsite.firebaseapp.com",
  projectId: "baadayewebsite",
  storageBucket: "baadayewebsite.appspot.com",
  messagingSenderId: "1093474888422",
  appId: "1:1093474888422:web:12996f46509b6ef6b36927",
  measurementId: "G-YQHMD54Z0R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

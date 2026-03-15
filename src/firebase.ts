// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjCgCUjjLGg2Jv9JAE3rV-j5E_gqU5foI",
  authDomain: "name1---name2-99572.firebaseapp.com",
  databaseURL: "https://name1---name2-99572-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "name1---name2-99572",
  storageBucket: "name1---name2-99572.firebasestorage.app",
  messagingSenderId: "763390235660",
  appId: "1:763390235660:web:af18d1b54461feeb54ca29",
  measurementId: "G-L4JS3378PT"
};

import { getAuth } from "firebase/auth";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const database = getDatabase(app);
const auth = getAuth(app);

export { app, analytics, database, auth };

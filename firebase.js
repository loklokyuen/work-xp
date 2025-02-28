import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDumOkNh5m8P2hJoYy-bbOQ-eTzJZOX9Qo",
    authDomain: "practice-db-49b16.firebaseapp.com",
    projectId: "practice-db-49b16",
    storageBucket: "practice-db-49b16.appspot.com",
    messagingSenderId: "820754662167",
    appId: "1:820754662167:web:cadef28e9702821f806d52",
    measurementId: "G-7N20GKQ40G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
// export const auth = getAuth(app);
export const db = getFirestore(app);
// export const database = getDatabase(app);

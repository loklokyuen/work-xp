import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, initializeAuth, getReactNativePersistence, browserLocalPersistence } from "firebase/auth";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
    measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
    databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const isReactNative = Platform.OS !== "web";
let persistence = null;
if (isReactNative) {
    persistence = getReactNativePersistence(AsyncStorage);
} else {
    persistence = browserLocalPersistence;
}
const auth = initializeAuth(app, { persistence });
export { db, auth };

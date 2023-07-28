import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {getStorage} from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABS9nzLSWdCUlmsBjNRUwukEE5MAchxwg",
  authDomain: "snowsage-test.firebaseapp.com",
  databaseURL: "https://snowsage-test-default-rtdb.firebaseio.com/",
  projectId: "snowsage-test",
  storageBucket: "snowsage-test.appspot.com",
  messagingSenderId: "212345181960",
  appId: "1:212345181960:web:ee0b1c532b968d8c48bebd",
  measurementId: "G-Z2GS7B1129"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage=getStorage(app);
export default app;

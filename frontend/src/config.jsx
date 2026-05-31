import { initializeApp } from "firebase/app";
import {getAuth , GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: "AIzaSyBP-F6izXfq38FxunkyFeixpw8k1c645RI",
  authDomain: "pizzapalace-62e31.firebaseapp.com",
  projectId: "pizzapalace-62e31",
  storageBucket: "pizzapalace-62e31.firebasestorage.app",
  messagingSenderId: "409125507846",
  appId: "1:409125507846:web:22055242dd551312078487",
  measurementId: "G-DZ8WPNEDQF"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
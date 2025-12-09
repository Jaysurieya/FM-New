import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCG5oiWcR4qYpQW-aH5nguwCV4j8N_zJ-s",
  authDomain: "fitmate-560ce.firebaseapp.com",
  projectId: "fitmate-560ce",
  storageBucket: "fitmate-560ce.appspot.com",
  messagingSenderId: "216659693512",
  appId: "1:216659693512:web:250015fe084ffb5bc1fafd",
  measurementId: "G-42KS1N599M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
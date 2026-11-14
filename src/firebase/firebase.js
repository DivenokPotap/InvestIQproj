import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBHkMfIJX3plUk648X1a7RC-7WF2WAzBbo",
  authDomain: "invest-iq-project.firebaseapp.com",
  projectId: "invest-iq-project",
  storageBucket: "invest-iq-project.firebasestorage.app",
  messagingSenderId: "155264343157",
  appId: "1:155264343157:web:faf0fb8a2e7a3e7359ec3c",
  measurementId: "G-9FRYV59S3H",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import  { getAuth, GoogleAuthProvider } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIRM2lB5lh-XriYj1kuy6l_jbMaaroELU",
  authDomain: "keluh-kesah-utbk.firebaseapp.com",
  projectId: "keluh-kesah-utbk",
  storageBucket: "keluh-kesah-utbk.appspot.com",
  messagingSenderId: "1087541972366",
  appId: "1:1087541972366:web:7fcbe78593d7001870e8df",
  measurementId: "G-CEQFFL7BVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();
const database = getFirestore(app)
export { app, auth, analytics, provider, database}

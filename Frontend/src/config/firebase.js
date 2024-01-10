// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhPY87R49UF4mjm67B-KtjnwzJXGaocSs",
  authDomain: "smapchat-bc4cd.firebaseapp.com",
  projectId: "smapchat-bc4cd",
  storageBucket: "smapchat-bc4cd.appspot.com",
  messagingSenderId: "1029141782614",
  appId: "1:1029141782614:web:dee9fdb117f9c591e89bf7",
  measurementId: "G-EGRYS7DFVP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export default app;

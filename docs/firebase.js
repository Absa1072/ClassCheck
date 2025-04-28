// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC59MPssGSBhB4R4jDYjWv-D-hG1gl0hEA",
  authDomain: "causal-cacao-457203-s1.firebaseapp.com",
  databaseURL: "https://causal-cacao-457203-s1-default-rtdb.firebaseio.com",
  projectId: "causal-cacao-457203-s1",
  storageBucket: "causal-cacao-457203-s1.firebasestorage.app",
  messagingSenderId: "604345231228",
  appId: "1:604345231228:web:c61b68eccff94d1d5826f9",
  measurementId: "G-MJMBCWMNKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export {firebaseConfig};

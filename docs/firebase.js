// Import the database from Firebase using the API key
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAAbcJ3zCGmz4fm9Bpq7Pr0nU6Pr9m8VYY",
  authDomain: "classcheck-44237.firebaseapp.com",
  databaseURL: "https://classcheck-44237-default-rtdb.firebaseio.com",
  projectId: "classcheck-44237",
  storageBucket: "classcheck-44237.firebasestorage.app",
  messagingSenderId: "223098378880",
  appId: "1:223098378880:web:79a616def53d5c3b50a465",
  measurementId: "G-5971Z3SLTV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// export the firebaseConfig so it can be used in other html files when trying to access the database
export { firebaseConfig };

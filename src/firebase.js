import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDjRgkAwy-I-gwnzbFs7DhcT2ljaDc5awM",
//   authDomain: "windy-bounty-466717-q5.firebaseapp.com",
//   projectId: "windy-bounty-466717-q5",
//   storageBucket: "windy-bounty-466717-q5.firebasestorage.app",
//   messagingSenderId: "454280480783",
//   appId: "1:454280480783:web:45be75fe732a882967fb7a",
//   measurementId: "G-8K2MDLX3FW"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();

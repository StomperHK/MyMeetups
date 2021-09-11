import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQZHjL9XkUHzDuU6LGzc3Bek0-hpErqyk",
  authDomain: "meetup-app-81ab3.firebaseapp.com",
  databaseURL: "https://meetup-app-81ab3-default-rtdb.firebaseio.com",
  projectId: "meetup-app-81ab3",
  storageBucket: "meetup-app-81ab3.appspot.com",
  messagingSenderId: "368826683047",
  appId: "1:368826683047:web:5bc29d97084b51f25d5582"
};

initializeApp(firebaseConfig)

export default getFirestore();

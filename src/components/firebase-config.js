import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBENmXr9HlEuPcvg-CHE0_kYcmPLnfannQ",
  authDomain: "craftconnect-fe449.firebaseapp.com",
  projectId: "craftconnect-fe449",
  storageBucket: "craftconnect-fe449.appspot.com",
  messagingSenderId: "480366842452",
  appId: "1:480366842452:web:c4dd844d887be83518d3c1",
  measurementId: "G-E6XJDYEB6L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage, collection, getDocs, doc, setDoc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL };

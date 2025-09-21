// Replace the firebaseConfig with your Firebase web app config.
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDcbgn4r0QmnQoy8o3z9FruZj-m19z4F-A",
  authDomain: "ckb-checkkarobadshaho.firebaseapp.com",
  databaseURL: "https://ckb-checkkarobadshaho-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ckb-checkkarobadshaho",
  storageBucket: "ckb-checkkarobadshaho.firebasestorage.app",
  messagingSenderId: "369255761964",
  appId: "1:369255761964:web:2ed262c0474da52bb62989",
  measurementId: "G-GBETJ3SEM4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, RecaptchaVerifier };

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCBdL3xpnZCIomVtCqqTmDznwQe38rEy54',
  authDomain: 'twitter-clone-fee7c.firebaseapp.com',
  projectId: 'twitter-clone-fee7c',
  storageBucket: 'twitter-clone-fee7c.appspot.com',
  messagingSenderId: '649311428201',
  appId: '1:649311428201:web:cdbc572735e154c3170cf8',
  measurementId: 'G-1PWEWYGQFQ',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;

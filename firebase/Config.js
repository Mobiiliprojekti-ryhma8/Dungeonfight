import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

import Config from 'react-native-config';

const firebaseConfig = {
  apiKey: Config.FIREBASE_API_KEY,
  authDomain: Config.FIREBASE_AUTH_DOMAIN,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: Config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Config.FIREBASE_MESSAGING_SENDER_ID,
  appId: Config.FIREBASE_APP_ID,
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
} else {
  getApp();
}

const firestore = getFirestore();

const heroesCollection = collection(firestore, "heroes");

async function addHero(name, heroClass, gold, health, damage) {
  try {
    const docRef = await addDoc(heroesCollection, {
      name: name,
      class: heroClass,
      gold: gold,
      health: health,
      damage: damage
    });
  } catch (e) {
    console.error("Error adding hero: ", e);
  }
}

export {
  firestore,
  collection,
  addDoc,
  addHero
};

import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_AUTH_DOMAIN, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET } from '@env';
import { getApp, getApps, initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, orderBy, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
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
async function HighscoresCall(heroClass = null) {
  console.log("Fetching heroes...");
  let heroesList = [];
  let id = 1;

  try {
    let heroesQuery;

    
      // Get all heroes first
      heroesQuery = query(heroesCollection, orderBy("gold", "desc"));
    

    const snapshot = await getDocs(heroesQuery);

    snapshot.forEach((doc) => {
      const hero = {
        id: id,
        name: doc.data().name,
        class: doc.data().class,
        gold: doc.data().gold,
      };
      // If a heroClass filter is set, apply it manually
      if (!heroClass || hero.class === heroClass) {
        heroesList.push(hero);
        id += 1;
      }
    });

    //console.log("Heroes fetched:", heroesList);
    return heroesList;
  } catch (error) {
    console.error("Error searching the highscores:", error);
    return []; // Return an empty list if an error occurs
  }
}



export {
  addDoc,
  addHero, collection, firestore, HighscoresCall
};


import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_AUTH_DOMAIN, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET } from '@env';
import { getApp, getApps, initializeApp } from "firebase/app";
import { addDoc, collection, deleteDoc, getDocs, getFirestore, orderBy, query, where, updateDoc } from "firebase/firestore";

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

async function addHero(name, heroClass, gold, health, damage,level,monsters_defeated ) {
  try {
    const docRef = await addDoc(heroesCollection, {
      name: name,
      class: heroClass,
      gold: gold,
      health: health,
      damage: damage,
      level: level,
      monsters_defeated: monsters_defeated
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
      heroesQuery = query(heroesCollection, orderBy("monsters_defeated", "desc"));
    

    const snapshot = await getDocs(heroesQuery);

    snapshot.forEach((doc) => {
      const hero = {
        id: id,
        name: doc.data().name,
        class: doc.data().class,
        monsters_defeated: doc.data().monsters_defeated,
        level: doc.data().level
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

async function deleteHeroFromDatabase(name){
  try {
    const heroesQuery = query(heroesCollection, where("name", "==", name));
    const snapshot = await getDocs(heroesQuery);
    snapshot.forEach(async (docSnapshot) => {
      await deleteDoc(docSnapshot.ref);
      console.log(`Hero with name "${name}" deleted successfully.`);
    });
  } catch (error) {
    console.error("Error deleting hero: ", error);
  }
}

async function updateHero(name, item) {
  try {
    const heroesQuery = query(heroesCollection, where("name", "==", name));
    const snapshot = await getDocs(heroesQuery);

    snapshot.forEach(async (docSnapshot) => {
      const heroData = docSnapshot.data();

      const updatedData = {};

      if (item === 'health') {
        updatedData.health = heroData.health + 1
        updatedData.gold = heroData.gold - 100
      } else if (item === 'damage') {
        updatedData.damage = heroData.damage + 1
        updatedData.gold = heroData.gold - 100
      }

      await updateDoc(docSnapshot.ref, updatedData);
    });
  } catch (error) {
    console.error(error);
  }
}

async function updateGold(name, amount) {
  try {
    const heroesQuery = query(heroesCollection, where("name", "==", name));
    const snapshot = await getDocs(heroesQuery);

    snapshot.forEach(async (docSnapshot) => {

      const updatedData = {};

      updatedData.gold = amount

      await updateDoc(docSnapshot.ref, updatedData);
    });
  } catch (error) {
    console.error(error);
  }
}

export {
  addDoc,
  addHero, collection, deleteHeroFromDatabase, firestore, HighscoresCall, updateHero, updateGold
};


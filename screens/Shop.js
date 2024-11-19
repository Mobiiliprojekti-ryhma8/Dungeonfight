import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Shop({ navigation }) {
  const [gold, setGold] = useState(0);
  const [heroes, setHeroes] = useState('');
  const [health, setHealth] = useState(0);
  const [damage, setDamage] = useState(0);
  const healthPrice = 100;
  const damagePrice = 100;

  useEffect(() => {
    async function getCurrentHero() {
      try {
        const storedHeroes = await AsyncStorage.getItem('heroes');
        const heroesList = storedHeroes ? JSON.parse(storedHeroes) : [];

        if (heroesList.length > 0) {
          const currentHero = heroesList[0];
          setHeroes(currentHero.name);
          console.log("heroesList", heroesList);
          fetchHeroData(currentHero.name);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getCurrentHero();
  }, []);

  async function fetchHeroData(heroName) {
    try {
      const docRef = doc(firestore, 'heroes', heroName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const heroData = docSnap.data();
        setGold(heroData.gold);
        setHealth(heroData.health);
        setDamage(heroData.damage);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handlePurchase = async (item) => {
    const price = item === 'health' ? healthPrice : damagePrice;

    if (gold >= price) {
      try {
        const docRef = doc(firestore, 'heroes', heroes);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const heroData = docSnap.data();
          const newGold = gold - price;
          const newAttributeValue = item === 'health'
            ? (heroData.health || 0) + 5
            : (heroData.damage || 0) + 5;

          await updateDoc(docRef, {
            gold: newGold,
            [item]: newAttributeValue,
          });
          setGold(newGold);
          item === 'health' ? setHealth(newAttributeValue) : setDamage(newAttributeValue);
          Alert.alert('Purchase Successful');
        }
      } catch (error) {
        console.error('Error updating hero:', error);
      }
    } else {
      Alert.alert('Not Enough Gold');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16 }}>You have {gold} gold</Text>
      <Button title="Buy Health (100 gold)" onPress={() => handlePurchase('health')} />
      <Button title="Buy Attack (100 gold)" onPress={() => handlePurchase('damage')} />
    </View>
  );
}

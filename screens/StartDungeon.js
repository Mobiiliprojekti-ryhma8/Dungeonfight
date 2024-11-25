import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StartDungeon({ navigation, route }) {
  const { hero } = route.params; 
  const [currentHero, setCurrentHero] = useState(hero);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const storedHeroes = await AsyncStorage.getItem('heroes');
        const heroes = storedHeroes ? JSON.parse(storedHeroes) : [];
        const updatedHero = heroes.find((h) => h.name === hero.name);
        if (updatedHero) {
          setCurrentHero(updatedHero);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchHero);

    return unsubscribe; 
  }, [navigation, hero.name]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20 }}>Hero: {currentHero.name}</Text>
      <Text>Class: {currentHero.heroClass}</Text>
      <Text>Health: {currentHero.health}</Text>
      <Text>Damage: {currentHero.damage}</Text>
      <Text>Gold: {currentHero.gold}</Text>

      <Button
        title="Start Dungeon"
        onPress={() => navigation.navigate('Dungeon', { hero: currentHero })}
      />
      <Button
        title="Go to Shop"
        onPress={() => navigation.navigate('Shop', { hero: currentHero })}
      />
      <Button
        title="Return Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import backgroundImage from '../assets/background.jpg';

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

  const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, color: 'white', padding: 3 }}>Hero: {currentHero.name}</Text>
      <Text style={styles.text}>Class: {currentHero.heroClass}</Text>
      <Text style={styles.text}>Health: {currentHero.health}</Text>
      <Text style={styles.text}>Damage: {currentHero.damage}</Text>
      <Text style={styles.text}>Gold: {currentHero.gold}</Text>

      <CustomButton
          title="Start Dungeon"
          onPress={() => navigation.navigate('Dungeon', { hero: currentHero })}
        />
        <CustomButton
          title="Go to Shop"
          onPress={() => navigation.navigate('Shop', { hero: currentHero })}
        />
        <CustomButton
          title="Return Home"
          onPress={() => navigation.navigate('Home')}
        />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  text: {
    color: 'white',
    fontSize: 16,
    padding: 1
  },
  button: {
    backgroundColor: '#8b0000',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Alert, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateHero } from '../firebase/Config';
import backgroundImage from '../assets/background.jpg';
  
export default function Shop({ navigation, route }) {
    const { hero } = route.params;
    const [updatedHero, setUpdatedHero] = useState(hero);
  
    const handlePurchase = async (item) => {
      if (updatedHero.gold >= 100) {
        let newHero = { ...updatedHero };
  
        if (item === 'health') {
          newHero.gold -= 100;
          newHero.health += 1;
        } else if (item === 'damage') {
          newHero.gold -= 100;
          newHero.damage += 1;
        }
  
        setUpdatedHero(newHero);
  
        try {
          const storedHeroes = await AsyncStorage.getItem('heroes');
          const heroes = storedHeroes ? JSON.parse(storedHeroes) : [];
  
          const updatedHeroes = heroes.map(h => 
            h.name === newHero.name ? newHero : h
          );
  
          await AsyncStorage.setItem('heroes', JSON.stringify(updatedHeroes));
          updateHero(updatedHero.name, item)
  
          Alert.alert('Item purchased!');
        } catch (error) {
          console.error('Error updating hero in storage:', error);
          Alert.alert('Failed to update hero.');
        }
      } else {
        Alert.alert('Not enough gold.');
      }
    };

    const CustomButton = ({ title, onPress }) => (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    );
  
    return (
      <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.text}>You have {updatedHero.gold} gold</Text>
        <Text style={styles.text}>Health: {updatedHero.health}</Text>
        <Text style={styles.text}>Damage: {updatedHero.damage}</Text>
  
        <CustomButton title="Buy Health (100 gold)" onPress={() => handlePurchase('health')} />
        <CustomButton title="Buy Attack (100 gold)" onPress={() => handlePurchase('damage')} />
        <CustomButton
          title="Return to Dungeon"
          onPress={() => navigation.navigate('StartDungeon', { hero: updatedHero })}
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
    padding: 3,
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
  
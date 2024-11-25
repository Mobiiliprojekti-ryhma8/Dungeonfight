import React, { useState } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateHero } from '../firebase/Config';
  
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
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 16 }}>You have {updatedHero.gold} gold</Text>
        <Text style={{ fontSize: 16 }}>Health: {updatedHero.health}</Text>
        <Text style={{ fontSize: 16 }}>Damage: {updatedHero.damage}</Text>
  
        <Button title="Buy Health (100 gold)" onPress={() => handlePurchase('health')} />
        <Button title="Buy Attack (100 gold)" onPress={() => handlePurchase('damage')} />
        <Button
          title="Return to Dungeon"
          onPress={() => navigation.navigate('StartDungeon', { hero: updatedHero })}
        />
      </View>
    );
}
  
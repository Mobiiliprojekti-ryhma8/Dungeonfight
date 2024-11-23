import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert } from 'react-native';
import { updateHero } from '../firebase/Config';

export default function Shop({ navigation, route }) {
  const { hero: initialHero } = route.params;
  const [hero, setHero] = useState(initialHero);

  const handlePurchase = async (item) => {
    if (hero.gold >= 100) {
      let updatedHero = { ...hero };

      if (item === 'health') {
        updatedHero.gold -= 100;
        updatedHero.health += 1;
      } else if (item === 'damage') {
        updatedHero.gold -= 100;
        updatedHero.damage += 1;
      }

      setHero(updatedHero);
      updateHero(updatedHero.name, item);

      Alert.alert(`Item purchased!`);
    } else {
      Alert.alert('Not enough gold.');
    }
  };


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 16 }}>You have {hero.gold} gold</Text>
      <Text style={{ fontSize: 16 }}>Health: {hero.health}</Text>
      <Text style={{ fontSize: 16 }}>Damage: {hero.damage}</Text>

      <Button title="Buy Health (100 gold)" onPress={() => handlePurchase('health')} />
      <Button title="Buy Attack (100 gold)" onPress={() => handlePurchase('damage')} />
    </View>
  );
}

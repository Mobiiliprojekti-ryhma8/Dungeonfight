import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { addHero } from '../firebase/Config';

const CreateCharacter = () => {
  const [name, setName] = useState('');
  const [heroClass, setHeroClass] = useState('');

  const handleCreateHero = async () => {
    if(heroClass === '') {
      Alert.alert('Please select class.')
      return
    }

    if(name === '') {
      Alert.alert('Please give your hero a name.')
      return
    }

    const storedHeroes = await AsyncStorage.getItem('heroes');
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : [];

    if (heroes.some(hero => hero.name.toLowerCase() === name.toLowerCase())) {
      Alert.alert('This name already exists. Please choose a different name.')
      return
    }

    let health = 0;
    let damage = 0;
    let level = 1;
    let monsters_defeated = 0;
    if (heroClass === 'warrior') {
      health = 25;
      damage = 3;
    } else if (heroClass === 'wizard') {
      health = 20;
      damage = 5;
    }

  const hero = { name, heroClass, gold: 0, health, damage,level,monsters_defeated }

    try {
      await addHero(name, heroClass, 0, health, damage,level,monsters_defeated);

      heroes.push(hero);

      await AsyncStorage.setItem('heroes', JSON.stringify(heroes));
      console.log(heroes)
      Alert.alert(`${heroClass} has been created!`);
      setName('');
      setHeroClass('');
    } catch (error) {
      console.error('Error creating hero:', error);
      Alert.alert('Failed to create hero');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Create a New Hero</Text>

      {}
      <Text>Name:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 10,
          marginBottom: 15,
        }}
        placeholder="Name your hero"
        value={name}
        onChangeText={setName}
      />

      {}
      <Text>Choose class:</Text>
      <Picker
        selectedValue={heroClass}
        onValueChange={(itemValue) => setHeroClass(itemValue)}
        style={{ marginBottom: 15 }}
      >
        <Picker.Item label="Select Class" value="" />
        <Picker.Item label="Warrior" value="warrior" />
        <Picker.Item label="Wizard" value="wizard" />
      </Picker>

      {}
      <Button title="Create Hero" onPress={handleCreateHero} />
    </View>
  );
};

export default CreateCharacter;

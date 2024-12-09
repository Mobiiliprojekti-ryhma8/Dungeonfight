import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Alert, TouchableOpacity, Text, TextInput, View, StyleSheet, ImageBackground } from 'react-native';
import { addHero } from '../firebase/Config';
import backgroundImage from '../assets/background.jpg';
import { useNavigation } from '@react-navigation/native';

const CreateCharacter = () => {
  const [name, setName] = useState('');
  const [heroClass, setHeroClass] = useState('');
  const navigation = useNavigation();

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
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error creating hero:', error);
      Alert.alert('Failed to create hero');
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>Create a New Hero</Text>

      {}
      <Text style={styles.text}>Name:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 10,
          marginBottom: 15,
          color: 'white'
        }}
        placeholder="Name your hero"
        placeholderTextColor="#FFFFFF"
        value={name}
        onChangeText={setName}
      />

      {}
      <Text style={styles.text}>Choose class:</Text>
      <Picker
        selectedValue={heroClass}
        onValueChange={(itemValue) => setHeroClass(itemValue)}
        style={{ marginBottom: 15, color: 'white'}}
      >
        <Picker.Item label="Select Class" value="" color= 'white' />
        <Picker.Item label="Warrior" value="warrior" color='white' />
        <Picker.Item label="Wizard" value="wizard" color='white' />
      </Picker>

      {}
      <TouchableOpacity style={styles.button} onPress={handleCreateHero}>
          <Text style={styles.buttonText}>Create Hero</Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  text: {
    color: 'white'
  },
  button: {
    backgroundColor: '#8b0000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreateCharacter;

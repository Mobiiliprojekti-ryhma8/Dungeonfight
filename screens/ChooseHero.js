import AsyncStorage from '@react-native-async-storage/async-storage';

import React, { useEffect, useState, useCallback } from 'react';
import { Alert, Button, FlatList, Text, View } from 'react-native';
import { deleteHeroFromDatabase } from '../firebase/Config';
import { useFocusEffect } from '@react-navigation/native';

export default function ChooseHero({navigation}) {
  const [heroes, setHeroes] = useState([])

  const fetchHeroes = async () => {
    try {
      const storedHeroes = await AsyncStorage.getItem('heroes');
      const heroesList = storedHeroes ? JSON.parse(storedHeroes) : [];
      setHeroes(heroesList);
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHeroes();
    }, [])
  );

  async function deleteCharacter(item) {
    console.log(item);
    
    try {
      await deleteHeroFromDatabase(item.name)
      const storedHeroes = await AsyncStorage.getItem('heroes')
      const heroesList = storedHeroes ? JSON.parse(storedHeroes) : []
      const newList = heroesList.filter(hero => hero.name !== item.name)
      await AsyncStorage.setItem('heroes', JSON.stringify(newList));
      console.log("success:",item.name);
      Alert.alert("Hero named:",item.name+ " deleted");
      navigation.replace('ChooseHero');
    } catch (error) {
      console.log("Error deleting hero",item.name+":",error);
      
    }
  }
  const renderHero = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: 'gray' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
      <Text>Class: {item.heroClass}</Text>
      <Text>Gold: {item.gold}</Text>
      <Text>Health: {item.health}</Text>
      <Text>Damage: {item.damage}</Text>
      <Button title='Choose Hero'
        onPress={() => navigation.navigate('StartDungeon', { hero: item })}
      ></Button>
      <Button title='Delete Hero'
        color="red"
        onPress={() => {deleteCharacter(item)}
        } 
      ></Button>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: 'center', paddingTop: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Choose a Hero</Text>
      <FlatList
        data={heroes}
        renderItem={renderHero}
        keyExtractor={(item, index) => index.toString()}
        style={{ width: '100%' }}
      />
    </View>
  );
}

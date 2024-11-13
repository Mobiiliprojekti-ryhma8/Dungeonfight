import { View, Text, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ChooseHero() {
  const [heroes, setHeroes] = useState([])

  useEffect(() => {
    const fetchHeroes = async () => {
      try {
        const storedHeroes = await AsyncStorage.getItem('heroes')
        const heroesList = storedHeroes ? JSON.parse(storedHeroes) : []
        setHeroes(heroesList)
      } catch (error) {
        console.error(error)
      }
    }

    fetchHeroes()
  }, [])

  const renderHero = ({ item }) => (
    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: 'gray' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
      <Text>Class: {item.heroClass}</Text>
      <Text>Gold: {item.gold}</Text>
      <Text>Health: {item.health}</Text>
      <Text>Damage: {item.damage}</Text>
      <Button title='Choose Hero'></Button>
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

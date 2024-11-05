import React from 'react';
import { Button, Text, View } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <Button
        title="Go to Dungeon"
        onPress={() => navigation.navigate('Dungeon')}
      />
      <Button
        title="Go to Shop"
        onPress={() => navigation.navigate('Shop')}
      />
      <Button
        title="Go to Highscores"
        onPress={() => navigation.navigate('Highscores')}
      />
    </View>
  );
}
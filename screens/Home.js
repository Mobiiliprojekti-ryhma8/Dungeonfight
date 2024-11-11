import React from 'react';
import { Button, Text, View } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <Button
        title='Go to Create Hero'
        onPress={() => navigation.navigate('CreateHero')}
      />
      <Button
        title='Go to Choose Hero'
        onPress={() => navigation.navigate('ChooseHero')}
      />
      <Button
        title="Go to Highscores"
        onPress={() => navigation.navigate('Highscores')}
      />
    </View>
  );
}
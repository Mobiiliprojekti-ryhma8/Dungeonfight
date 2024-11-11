import { View, Text, Button } from 'react-native'
import React, { useLayoutEffect } from 'react'

export default function StartDungeon({navigation}) {

    useLayoutEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <Button
              title="Home"
              onPress={() => navigation.navigate('Home')}
            />
          ),
        });
      }, [navigation]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>StartDungeon</Text>
      <Button
        title="Start Dungeon"
        onPress={() => navigation.navigate('Dungeon')}
      />
      <Button
        title="Go to Shop"
        onPress={() => navigation.navigate('Shop')}
      />
    </View>
  )
}
import { View, Text, Button } from 'react-native'
import React from 'react'

export default function ChooseHero({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>ChooseHero</Text>
      <Button
        title='Choose Hero'
        onPress={() => navigation.navigate('StartDungeon')}
      />
    </View>
  )
}
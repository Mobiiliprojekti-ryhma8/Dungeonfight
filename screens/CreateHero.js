import { View, Text, Button } from 'react-native'
import React from 'react'

export default function CreateHero({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Create Hero</Text>
      <Button
        title='Create Hero'
        onPress={() => navigation.navigate('StartDungeon')}
      />
    </View>
  )
}

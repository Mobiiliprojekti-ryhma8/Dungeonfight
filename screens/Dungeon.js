import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';

export default function Dungeon({ navigation }) {
    const [status, setStatus] = useState(true)

    useEffect(() => {
        if (!status) {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
          e.preventDefault();
    
         
            
         
          Alert.alert(
            "Are you sure?",
            "Do you really want to leave the dungeon?",
            [
              { text: "No", style: "cancel", onPress: () => {} },
              {
                text: "Yes",
                onPress: () => navigation.dispatch(e.data.action),
              },
            ]
          );
         
        });
            
        return unsubscribe;
        }
      }, [navigation,status ]);
    
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Dungeon</Text>
      
    </View>
  );
}
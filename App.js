import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Dungeon from './screens/Dungeon';
import Highscores from './screens/Highscores';
import Home from './screens/Home';
import Shop from './screens/Shop';
import CreateHero from './screens/CreateHero';
import StartDungeon from './screens/StartDungeon';
import ChooseHero from './screens/ChooseHero';
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from 'react';

export default function App() {
  const soundRef = useRef(null)
  const [currentRoute, setCurrentRoute] = useState("Home")

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          playsInSilentModeIOS: true,
        })

        if (!soundRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            require('./audio/soundtrack.mp3'),
            { shouldPlay: true, isLooping: true }
          )

          soundRef.current = sound
          await sound.playAsync()
        }
      } catch (error) {
        console.error("Error loading or playing audio", error)
      }
    }

    setupAudio()

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync()
        soundRef.current.unloadAsync()
      }
    }

  }, [])

  useEffect(() => {
    if (soundRef.current) {
      if (currentRoute === "Dungeon") {
        soundRef.current.pauseAsync()
      } else {
        soundRef.current.playAsync()
      }
    }
  }, [currentRoute])

  const Stack = createStackNavigator()
  return (
    <NavigationContainer
      onStateChange={(state) => {
        const current = state.routes[state.index].name
        setCurrentRoute(current)
    }}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateHero" component={CreateHero}/>
        <Stack.Screen name='Highscores' component={Highscores} />
        <Stack.Screen name='Dungeon' component={Dungeon} />
        <Stack.Screen name='Shop' component={Shop} />
        <Stack.Screen name='StartDungeon' component={StartDungeon}/>
        <Stack.Screen name='ChooseHero' component={ChooseHero}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
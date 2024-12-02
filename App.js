import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, View } from 'react-native';
import Dungeon from './screens/Dungeon';
import Highscores from './screens/Highscores';
import Home from './screens/Home';
import Shop from './screens/Shop';
import CreateHero from './screens/CreateHero';
import StartDungeon from './screens/StartDungeon';
import ChooseHero from './screens/ChooseHero';
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from 'react';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function App() {
  const soundRef = useRef(null);
  const [currentRoute, setCurrentRoute] = useState("Home");
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = async () => {
    if (soundRef.current) {
      if (isMuted) {
        await soundRef.current.setVolumeAsync(volume);
      } else {
        await soundRef.current.setVolumeAsync(0);
      }
      setIsMuted(!isMuted);
    }
  };

  const adjustVolume = async (newVolume) => {
    setVolume(newVolume);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(newVolume);
    }
  };

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          shouldDuckAndroid: false,
          playsInSilentModeIOS: true,
        });

        if (!soundRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            require('./audio/soundtrack.mp3'),
            { shouldPlay: true, isLooping: true }
          );

          soundRef.current = sound;
          await sound.playAsync();
        }
      } catch (error) {
        console.error("Error loading or playing audio", error);
      }
    };

    setupAudio();

    return () => {
      if (soundRef.current) {
        soundRef.current.stopAsync();
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (soundRef.current) {
      if (currentRoute === "Dungeon") {
        soundRef.current.pauseAsync();
      } else {
        soundRef.current.playAsync();
      }
    }
  }, [currentRoute]);

  const Stack = createStackNavigator();
  return (
    <NavigationContainer
      onStateChange={(state) => {
        const current = state.routes[state.index].name;
        setCurrentRoute(current);
      }}
    >
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateHero" component={CreateHero} />
        <Stack.Screen name='Highscores' component={Highscores} />
        <Stack.Screen name='Dungeon' component={Dungeon} />
        <Stack.Screen name='Shop' component={Shop} />
        <Stack.Screen name='StartDungeon' component={StartDungeon} />
        <Stack.Screen name='ChooseHero' component={ChooseHero} />
      </Stack.Navigator>

      <View style={styles.audioControlContainer}>
        {currentRoute !== 'Dungeon' && (
          <>
            <Ionicons
              name={isMuted ? "volume-mute" : "volume-high"}
              size={30}
              color="black"
              onPress={toggleMute}
            />
            
            {!isMuted && (
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={adjustVolume}
                step={0.01}
              />
            )}
          </>
        )}
    </View>
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
  audioControlContainer: {
    position: 'absolute',
    bottom: 50, 
    left: '25%',
    transform: [{ translateX: -100 }],
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    width: 200,
    marginLeft: 10,
  },
});

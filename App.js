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

export default function App() {
  const Stack = createStackNavigator()
  return (
    <NavigationContainer>
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
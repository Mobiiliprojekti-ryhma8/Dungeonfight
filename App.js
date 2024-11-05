import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import Dungeon from './screens/Dungeon';
import Highscores from './screens/Highscores';
import Home from './screens/Home';
import Shop from './screens/Shop';
export default function App() {
  const Stack = createStackNavigator()
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name='Highscores' component={Highscores} />
        <Stack.Screen name='Dungeon' component={Dungeon} />
        <Stack.Screen name='Shop' component={Shop} />
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
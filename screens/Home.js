import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, ImageBackground, Image } from 'react-native';
import backgroundImage from '../assets/background.jpg';
import logoImage from '../assets/dungeonfightlogo.jpg';

export default function Home({ navigation }) {
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.container}>
      <Image source={logoImage} style={styles.logo} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateHero')}>
          <Text style={styles.buttonText}>Create Hero</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ChooseHero')}>
          <Text style={styles.buttonText}>Choose Hero</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Highscores')}>
          <Text style={styles.buttonText}>Highscores</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 140,
  },
  logo: {
    width: 300,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 40,
    borderRadius: 40,
  },
  button: {
    backgroundColor: '#8b0000',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 16,
    marginVertical: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

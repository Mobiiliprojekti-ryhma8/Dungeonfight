import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { HighscoresCall } from '../firebase/Config';
import backgroundImage from '../assets/background.jpg';

export default function Highscores({ navigation }) {
  const [heroes, setHeroes] = useState([])
  const [startIndex, setStartIndex] = useState(0)
  const [luokka,setLuokka] = useState("");
  useEffect(() => {
    setHighscores(luokka);
  }, [luokka]);
  const DataToShow = heroes.slice(startIndex, startIndex + 20)

  async function setHighscores(luokka) {
    console.log("tsti");
    
    let heroData = await HighscoresCall(luokka)

    console.log("heroes for highscores",heroData);
    
    setHeroes(heroData)
    
  }
  const Item = ({ hero }) => (
    
    <View>
        <Text style={[
                styles.herolist,
                hero.status == "dead" ? styles.deadHero : null]}>{hero.id+" "}{hero.name+" "} {"monsters defeated "+ hero.monsters_defeated}</Text>
    </View>
);
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
    <View style={styles.container}>
      <Text style={{fontSize: 30, padding: 10, color: 'white'}}>Highscores</Text>
      <View style={styles.buttonContainer}>
        <Button
          title='Warriors'
          onPress={() =>{ setLuokka("warrior"),setStartIndex(0)}}
          />
          <Button
            title="All"
            onPress={() =>{ setLuokka(""),setStartIndex(0)}}
          />
          <Button
            title="Wizards"
            onPress={() =>{ setLuokka("wizard"),setStartIndex(0)}}
          />
        </View>
      <View style={styles.listContainer}>
            <FlatList
                data={DataToShow}
                renderItem={({ item }) => <Item hero={item} />}
                keyExtractor={item => item.id.toString()}
            ></FlatList> 
        </View>
        <View style={styles.buttonContainer}>
        <Button
          title='Previous page'
          onPress={() =>{ if(startIndex > 0){setStartIndex(startIndex-20)}}}
          />
          <Button
            title="Next page"
            onPress={() =>{ if(startIndex+20 < heroes.length){setStartIndex(startIndex+20)}}}
          />
        </View>
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
    alignItems: 'center', 
    justifyContent: 'center' ,
    paddingTop: 30,
},listContainer: {
  flex: 1,
  width: '100%', 
  alignItems: 'center', 
  justifyContent: 'center' ,
},herolist: {
  fontSize:20,
  padding: 6,
  color: 'white'
},  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '80%',
  paddingBottom: 20,
},
deadHero: {
  textDecorationLine: 'line-through',
  textDecorationStyle: 'solid',      
 // textDecorationColor: 'red',        
},
})

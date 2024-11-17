import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { HighscoresCall } from '../firebase/Config';
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

    //console.log("heroes for highscores",heroData);
    
    setHeroes(heroData)
    
  }
  const Item = ({ hero }) => (
    <View>
        <Text style={styles.herolist}>{hero.id+" "}{hero.name+" "} {"Gold "+ hero.gold} {hero.class}</Text>
    </View>
);
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 30, padding: 10}}>Highscores</Text>
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
  );
}
const styles = StyleSheet.create({
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
  fontSize:18,
  padding: 0
},  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '80%',
  paddingBottom: 20,
}
})

import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DamageAnimation from '../animations/DamageAnimation';
import backgroundImage from '../assets/background.jpg';
import monsterImage1 from '../assets/Enemy1.png';
import warriorImage from '../assets/Warrior.png';
import wizardImage from '../assets/wizard.png';
import { updateGold, updateMonstersDeafeated } from '../firebase/Config';

function Dungeon({ navigation, route }) {
    const {hero} = route.params
    const soundRef = useRef(null)
    const maxHp = hero.health

    const [playerHealth, setPlayerHealth] = useState(hero.health);
    const [enemyHealth, setEnemyHealth] = useState(10);
    const [enemyCount, setEnemyCount] = useState(1);
    const [healUses, setHealUses] = useState(3);
    const [playerDamage, setPlayerDamage] = useState(hero.damage);
    const [enemyDamage, setEnemyDamage] = useState(0);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [victory, setVictory] = useState(false); 
    const [damageKey, setDamageKey] = useState(0);
    const [volume, setVolume] = useState(1); 
    const [isMuted, setIsMuted] = useState(false); 
    const [totalGold, setGold] = useState(0)
    const [level, setLevel] = useState(1);
    const [enemyMaxHealth, setEnemyMaxHealth] = useState(10); 


    useEffect(() => {
        const setupDungeonAudio = async () => {
            try {
                if (!soundRef.current) {
                    const { sound } = await Audio.Sound.createAsync(
                        require('../audio/soundtrack2.mp3'),
                        { shouldPlay: true, isLooping: true }
                    )
                    soundRef.current = sound
                    await sound.playAsync()
                    sound.setVolumeAsync(volume);
                }
            } catch (error) {
                console.error("Error loading or playing dungeon audio", error)
            }
        }

        setupDungeonAudio()

        return () => {
            if (soundRef.current) {
                soundRef.current.stopAsync()
                soundRef.current.unloadAsync()
            }
        }
    }, [])

    const saveHeroToStorage = async (updatedHero) => {
        try {
          const storedHeroes = await AsyncStorage.getItem('heroes');
          const heroes = storedHeroes ? JSON.parse(storedHeroes) : [];
          const heroIndex = heroes.findIndex((h) => h.name === updatedHero.name);
      
          if (heroIndex !== -1) {
            heroes[heroIndex] = updatedHero;
          } else {
            heroes.push(updatedHero);
          }
      
          await AsyncStorage.setItem('heroes', JSON.stringify(heroes));
        } catch (error) {
          console.error(error);
        }
    };

    useEffect(() => {
        const updateHeroGold = async () => {
            hero.gold += totalGold;
            hero.monsters_defeated += 1;
            await saveHeroToStorage(hero);
            updateGold(hero.name, hero.gold)
            updateMonstersDeafeated(hero.name,hero.monsters_defeated)
        };
    
        updateHeroGold();
    }, [totalGold]);

    useEffect(() => {
        if (!isGameFinished) {
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {

                e.preventDefault();

                Alert.alert(
                    "Warning",
                    "Leaving now will result in the hero's death. Are you sure you want to exit?",
                    [
                        { text: "No", style: "cancel" },
                        {
                            text: "Yes",
                            onPress: () => {
                                navigation.dispatch(e.data.action);
                            },
                        },
                    ]
                );
            });

            return unsubscribe;
        }
    }, [navigation, isGameFinished]);

    const generateDrop = () => {
        const randPercentage = Math.random() * 100;
        let dropValue;
    
        if (randPercentage <= 50) {
            // This has a 50% chance of happening, generates gold between 1 and 50
            dropValue = Math.floor(Math.random() * 50) + 1;
        } else if (randPercentage <= 80) {
            // 30% chance of happening, generates gold between 51 and 80
            dropValue = Math.floor(Math.random() * 30) + 51;
        } else {
            // 20% chance of happening, generaets gold between 81 and 100
            dropValue = Math.floor(Math.random() * 20) + 81;
        }
    
        return dropValue;
    };

    const handleFight = () => {
        const playerDamageValue = Math.floor(Math.random() * hero.damage) + 1
        console.log(hero.damage)
        console.log("testi: "+ hero.monsters_defeated);
        //const playerDamageValue = Math.floor(Math.random() * 5) + 1; // Player damage between 1 and 5
        const enemyDamageValue = Math.floor(Math.random() * 3) + level; // Enemy damage between 1 and 3

        setPlayerDamage(playerDamageValue);
        setEnemyDamage(enemyDamageValue);

        // Force animation reset by updating the damageKey state
        setDamageKey(prevKey => prevKey + 1); // Increment key value to trigger re-render

        setEnemyHealth(prevHealth => Math.max(prevHealth - playerDamageValue, 0));
        setPlayerHealth(prevHealth => Math.max(prevHealth - enemyDamageValue, 0));

        if (playerHealth - enemyDamageValue <= 0) {
            setIsGameFinished(true);
            Alert.alert("Game Over", "You have been defeated!", [
                { text: "OK", onPress: () => navigation.navigate("Home") }
            ]);
        } else if (enemyHealth - playerDamageValue <= 0) {
            const dropValue = generateDrop();
            setGold(dropValue);
            console.log(`gold ${totalGold}`)
            setVictory(true);
            Alert.alert("Victory!", `You defeated Monster ${enemyCount} and got ${dropValue} gold!`, [
                {
                    text: "OK", onPress: () => {
                        if (enemyCount < 5) {
                            setEnemyCount(enemyCount + 1);
                            setVictory(false);
                            setEnemyHealth(prevHealth => 5 + (level * 5)); 
                            const newEnemyMaxHealth = 5 + (level * 5);
                            setEnemyMaxHealth(newEnemyMaxHealth);
                        } else {
                            setLevel(prevLevel => {
                                Alert.alert(`Congratulations, you beat level ${level}! Next level enemies are stronger.`)
                                const newLevel = prevLevel + 1;
                                setEnemyHealth(5 + (newLevel * 5)); 
                                const newEnemyMaxHealth = 5 + (newLevel * 5);
                                setEnemyMaxHealth(newEnemyMaxHealth);
                                return newLevel; 
                            });
                            setEnemyCount(1);
                        }
                    }
                }
            ]);
        }
    };

    const handleHeal = () => {
        if (healUses > 0 && playerHealth < maxHp) {
            setPlayerHealth(maxHp);
            setHealUses(healUses - 1);
        }
    };

    const toggleMute = () => {
        const newMuteState = !isMuted;
        setIsMuted(newMuteState);
    
        const newVolume = newMuteState ? 0 : volume;
        setVolume(newVolume);
    
        if (soundRef.current) {
            soundRef.current.setVolumeAsync(newVolume);
        }
    };

    const adjustVolume = async (newVolume) => {
        setVolume(newVolume);
        setIsMuted(newVolume === 0); 
    
        if (soundRef.current) {
            await soundRef.current.setVolumeAsync(newVolume); 
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>

                <Text style={styles.enemyCounter}>Monster {enemyCount}/5                  Level: {level}</Text>
        
                <Text style={styles.enemyHealth}>Enemy Health: {enemyHealth}/{enemyMaxHealth}</Text>

                <Image source={monsterImage1} style={styles.monster} />

                <View style={styles.playerContainer}>
                    <Text style={styles.playerHealth}>Your Health: {playerHealth}/{maxHp}</Text>
                    <Button title="Fight" onPress={handleFight} disabled={isGameFinished} />
                    <Button 
                        title={`Heal (${healUses})`} 
                        onPress={handleHeal} 
                        disabled={healUses === 0 || playerHealth === maxHp || isGameFinished} 
                    />
                </View>
                {hero.heroClass === 'warrior' ? (
                <Image source={warriorImage} style={styles.warrior} />
            ) : (
                <Image source={wizardImage} style={styles.wizard} />
            )}

                <DamageAnimation key={`enemy-damage-${damageKey}`} damage={enemyDamage} isPlayerDamage={true} />

                <DamageAnimation key={`player-damage-${damageKey}`} damage={playerDamage} isPlayerDamage={false} />

                <View style={styles.audioControlContainer}>
                    <Ionicons
                        name={isMuted ? "volume-mute" : "volume-high"}
                        size={30}
                        color="white"
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
                            minimumTrackTintColor="#1EB1FC"
                            maximumTrackTintColor="#FFFFFF"
                            trackStyle={{
                                backgroundColor: 'white', 
                                height: 10,               
                                borderRadius: 5,          
                            }}
                        />
                    )}
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
    },
    enemyCounter: {
        position: 'absolute',
        top: 30,
        left: 10,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',  
    },
    enemyHealth: {
        fontSize: 18,
        top: 120,
        fontWeight: 'bold',
        marginTop: 20,
        color: 'white',  
    },
    playerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
    },
    playerHealth: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white', 
    },
    monster: {
        position: 'absolute',
        top: 300,
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    warrior: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        width: 150,
        height: 180,
        resizeMode: 'contain',
    },
    wizard: {
        position: 'absolute',
        bottom: 50,
        left: 10,
        width: 200,
        height: 250,
        resizeMode: 'contain',
    },
    audioControlContainer: {
        position: 'absolute',
        top: 80, 
        right: 20,
        alignItems: 'center',
    },
    slider: {
        width: 200,
        marginTop: 10,  
    },
});

export default Dungeon;
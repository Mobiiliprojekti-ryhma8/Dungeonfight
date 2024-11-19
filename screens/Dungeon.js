import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button, Text, View, Image, StyleSheet, ImageBackground } from 'react-native';
import DamageAnimation from '../animations/DamageAnimation';
import warriorImage from '../assets/Warrior.webp';
import monsterImage1 from '../assets/Enemy1.webp';
import backgroundImage from '../assets/background.jpg';
import { Audio } from "expo-av";

function Dungeon({ navigation, route }) {
    const {hero} = route.params
    const soundRef = useRef(null)
    const maxHp = hero.heroClass === "warrior" ? 25 : 20

    const [playerHealth, setPlayerHealth] = useState(hero.health);
    const [enemyHealth, setEnemyHealth] = useState(10);
    const [enemyCount, setEnemyCount] = useState(1);
    const [healUses, setHealUses] = useState(3);
    const [playerDamage, setPlayerDamage] = useState(hero.damage);
    const [enemyDamage, setEnemyDamage] = useState(0);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [victory, setVictory] = useState(false); 
    const [damageKey, setDamageKey] = useState(0);

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

    useEffect(() => {
        if (!isGameFinished) {
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {

                e.preventDefault();

                Alert.alert(
                    "Warning",
                    "Leaving now will result in the hero's death. Are you sure you want to exit?",
                    [
                        { text: "No", style: "cancel" },
                        { text: "Yes", onPress: () => navigation.dispatch(e.data.action) },
                    ]
                );
            });

            return unsubscribe;
        }
    }, [navigation, isGameFinished]);

    const handleFight = () => {
        const randNum = Math.floor(Math.random() * 5) + 1
        const playerDamageValue = hero.heroClass === "wizard" ? randNum + 2 : randNum
        console.log(playerDamageValue)

        //const playerDamageValue = Math.floor(Math.random() * 5) + 1; // Player damage between 1 and 5
        const enemyDamageValue = Math.floor(Math.random() * 3) + 1; // Enemy damage between 1 and 3

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
            setVictory(true);
            Alert.alert("Victory!", `You defeated Monster ${enemyCount}!`, [
                {
                    text: "OK", onPress: () => {
                        if (enemyCount < 5) {
                            setEnemyCount(enemyCount + 1);
                            setVictory(false);
                            setEnemyHealth(10);
                        } else {
                            setIsGameFinished(true);
                            Alert.alert("Congratulations!", "You have defeated all enemies!", [
                                {
                                    text: "Back to Home",
                                    onPress: () => navigation.navigate("Home")
                                }
                            ]);
                        }
                    }
                }
            ]);
        }
    };

    const handleHeal = () => {
        if (healUses > 0 && playerHealth < 20) {
            setPlayerHealth(maxHp);
            setHealUses(healUses - 1);
        }
    };

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>

                <Text style={styles.enemyCounter}>Monster {enemyCount}/5</Text>

                <Text style={styles.enemyHealth}>Enemy Health: {enemyHealth}/10</Text>

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
                
                <Image source={warriorImage} style={styles.warrior} />

                <DamageAnimation key={`enemy-damage-${damageKey}`} damage={enemyDamage} isPlayerDamage={true} />

                <DamageAnimation key={`player-damage-${damageKey}`} damage={playerDamage} isPlayerDamage={false} />
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
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    warrior: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
});

export default Dungeon;
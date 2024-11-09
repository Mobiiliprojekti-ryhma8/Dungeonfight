import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const DamageAnimation = ({ damage, isPlayerDamage = false }) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    // Start the animation when damage is passed
    useEffect(() => {
        if (damage > 0) {
            // Reset the animation value to restart animation
            animatedValue.setValue(0);

            // Start the animation
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1000, // Animation duration (1000ms)
                useNativeDriver: true, // Use native driver for performance
            }).start(() => {
                // Fade-out animation after damage
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: 1000, // Fade-out duration
                    useNativeDriver: true, // Use native driver for performance
                }).start();
            });
        }
    }, [damage, animatedValue]); // Trigger animation when damage changes

    const displayDamage = `-${damage}`;

    return (
        <Animated.View
            style={[
                styles.damageBox,
                {
                    opacity: animatedValue, // Binding the animated value to opacity
                    backgroundColor: isPlayerDamage ? 'blue' : 'red', // Player damage (blue) or enemy damage (red)
                    top: isPlayerDamage ? undefined : 200, // Position for enemy damage
                    bottom: isPlayerDamage ? 120 : undefined, // Position for player damage
                },
            ]}
        >
            <Text style={styles.damageText}>{displayDamage}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    damageBox: {
        position: 'absolute',
        width: 60,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    damageText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
});

export default DamageAnimation;

import React from 'react';
import { View, Image, StyleSheet, ViewStyle, DimensionValue } from 'react-native';

interface LubbiLogoProps {
  size?: DimensionValue;
  style?: ViewStyle;
}

export function LubbiLogo({ size = 100, style }: LubbiLogoProps) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.backgroundShape} />
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={[styles.logo, { width: size, height: size }]} 
        resizeMode="contain" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    padding: 10,
  },
  backgroundShape: {
    position: 'absolute',
    width: '90%',
    height: '60%',
    backgroundColor: '#1C2E4A',
    borderRadius: 40, // Forma redondeada abstracta (tipo cápsula)
    transform: [{ rotate: '-10deg' }], // Ligera inclinación para un toque moderno
    opacity: 0.8,
  },
  logo: {
    // El tamaño viene de los props
  },
});

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const sloganAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(sloganAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Pasa automáticamente a la pantalla principal después de 3 segundos
    const timer = setTimeout(() => {
      router.replace('/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Logo animado */}
      <Animated.Image
        source={require('../../assets/images/logo.png')}
        style={[
          styles.logo,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
        resizeMode="contain"
      />

      {/* Slogan animado */}
      <Animated.View style={{ opacity: sloganAnim }}>
        <ThemedText style={styles.slogan}>
          El lubricante que necesitas, donde estás
        </ThemedText>
      </Animated.View>

      {/* Botón saltar */}
      <TouchableOpacity style={styles.botonSaltar} onPress={() => router.replace('/home')}>
        <ThemedText style={styles.botonTexto}>Saltar →</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  logo: {
    width: 220,
    height: 220,
  },
  slogan: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
    fontStyle: 'italic',
  },
  botonSaltar: {
    position: 'absolute',
    bottom: 60,
    right: 30,
  },
  botonTexto: {
    color: '#4A90D9',
    fontSize: 16,
  },
});
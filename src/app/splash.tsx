import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { obtenerSesion } from '../utils/session';

export default function Splash() {
  useEffect(() => {
    const checkAuth = async () => {
      // Simular tiempo de carga del splash
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sesion = await obtenerSesion();

      if (sesion && sesion.activa) {
        if (sesion.rol === 'comprador') {
          router.replace('/cliente-home' as any);
        } else if (sesion.rol === 'vendedor') {
          router.replace('/vendedor-home' as any);
        } else {
          router.replace('/login');
        }
      } else {
        router.replace('/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/logo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.titulo}>LUBBI</Text>
      <Text style={styles.eslogan}>El lubricante que necesitas, donde estás</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  titulo: {
    color: '#FFD700',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eslogan: {
    color: '#4A90D9',
    fontSize: 16,
    fontStyle: 'italic',
  }
});
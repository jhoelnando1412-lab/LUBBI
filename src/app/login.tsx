import { router } from 'expo-router';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    
    try {
      await AsyncStorage.setItem('sesion', 'activa');
      router.replace('/home');
    } catch (e) {
      Alert.alert('Error', 'No se pudo guardar la sesión.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Image 
              source={require('../../assets/images/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
            <Text style={styles.titulo}>LUBBI</Text>
            <Text style={styles.eslogan}>El lubricante que necesitas, donde estás</Text>
          </View>

          <View style={styles.formContainer}>
            <InputField
              label="Correo electrónico"
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <InputField
              label="Contraseña"
              placeholder="Tu contraseña"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <PrimaryButton 
              texto="Iniciar sesión" 
              onPress={iniciarSesion} 
              buttonStyle={styles.loginBoton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTexto}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/registro')}>
              <Text style={styles.registroEnlace}>Regístrate</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  titulo: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eslogan: {
    color: '#4A90D9',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  loginBoton: {
    marginTop: 24,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  footerTexto: {
    color: '#999999',
    fontSize: 15,
  },
  registroEnlace: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Ingresa tu correo y contraseña.');
      return;
    }
    
    // Por ahora solo navegamos a /home (se conectará a backend luego)
    console.log('Login attempt con:', email, password);
    router.replace('/home');
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          
          <View style={styles.header}>
            <Text style={styles.titulo}>LUBBI</Text>
            <Text style={styles.eslogan}>El lubricante que necesitas, donde estás</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.bienvenido}>Bienvenido de nuevo</Text>
            
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
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <View style={styles.olvidoContainer}>
              <TouchableOpacity>
                <Text style={styles.olvidoTexto}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            </View>

            <PrimaryButton 
              title="Iniciar sesión" 
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
    backgroundColor: '#121215',
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  titulo: {
    color: '#FF8C00',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
  },
  eslogan: {
    color: '#A0A0B0',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bienvenido: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  olvidoContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  olvidoTexto: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '600',
  },
  loginBoton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  footerTexto: {
    color: '#A0A0B0',
    fontSize: 15,
  },
  registroEnlace: {
    color: '#FF8C00',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

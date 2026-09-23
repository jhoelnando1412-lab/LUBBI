import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { guardarSesion } from '../utils/session';
import { LubbiLogo } from '../components/LubbiLogo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const iniciarSesion = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    
    try {
      const respuesta = await fetch(
        'http://192.168.1.43:3000/api/usuarios/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password
          }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('Error', datos.mensaje || 'Error al iniciar sesión.');
        return;
      }

      await guardarSesion({
        activa: true,
        usuario_id: datos.usuario.id,
        nombre: datos.usuario.nombre,
        apellido: datos.usuario.apellido,
        email: datos.usuario.email,
        rol: datos.usuario.rol,
      });

      if (datos.usuario.rol === 'comprador') {
        router.replace('/cliente-home' as any);
      } else if (datos.usuario.rol === 'vendedor') {
        router.replace('/vendedor-home' as any);
      } else {
        router.replace('/home'); // Fallback or admin
      }

    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
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
            <LubbiLogo size={120} />
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
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: '#0A1628', padding: 24, justifyContent: 'center' },
  header: { marginTop: 40, marginBottom: 40, alignItems: 'center' },
  logo: { width: 120, height: 120, marginBottom: 16 },
  titulo: { color: '#FFD700', fontSize: 36, fontWeight: 'bold', marginBottom: 8 },
  eslogan: { color: '#4A90D9', fontSize: 16, fontStyle: 'italic', textAlign: 'center' },
  formContainer: { flex: 1 },
  loginBoton: { marginTop: 24, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  footerTexto: { color: '#999999', fontSize: 15 },
  registroEnlace: { color: '#FFD700', fontSize: 15, fontWeight: 'bold' }
});

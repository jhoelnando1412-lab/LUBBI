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

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');

  const registrar = async () => {
    if (!nombre || !apellido || !email || !password) {
      Alert.alert('Campos incompletos', 'Completa los campos obligatorios.');
      return;
    }

    try {
      const respuesta = await fetch(
        'http://192.168.1.43:3000/api/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            apellido,
            email,
            telefono,
            password_hash: password,
          }),
        }
      );

      const datos = await respuesta.json();

console.log('Respuesta del servidor:', datos);

if (!respuesta.ok) {
  Alert.alert(
    'Error',
    datos.mensaje || 'No se pudo registrar.'
  );
  return;
}

Alert.alert(
  'Registro exitoso',
  'Tu cuenta fue creada correctamente.'
);

router.replace('/home');
    } catch (error) {
      console.error(error);

      Alert.alert(
        'Error de conexión',
        'No se pudo conectar con el servidor.'
      );
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
            <Text style={styles.titulo}>Crear cuenta</Text>
            <Text style={styles.subtitulo}>Regístrate en LUBBI</Text>
          </View>

          <View style={styles.formContainer}>
            <InputField
              label="Nombre *"
              placeholder="Tu nombre"
              value={nombre}
              onChangeText={setNombre}
            />

            <InputField
              label="Apellido *"
              placeholder="Tu apellido"
              value={apellido}
              onChangeText={setApellido}
            />

            <InputField
              label="Correo electrónico *"
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <InputField
              label="Teléfono"
              placeholder="Número de celular"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            <InputField
              label="Contraseña *"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            <PrimaryButton 
              title="Registrarme" 
              onPress={registrar} 
              buttonStyle={styles.registerBoton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTexto}>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginEnlace}>Inicia sesión</Text>
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
    justifyContent: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  titulo: {
    color: '#FF8C00',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    color: '#A0A0B0',
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  registerBoton: {
    marginTop: 16,
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
    color: '#A0A0B0',
    fontSize: 15,
  },
  loginEnlace: {
    color: '#FF8C00',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
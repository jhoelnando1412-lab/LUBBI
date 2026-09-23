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
  Image,
} from 'react-native';
import { InputField } from '../components/InputField';
import { PrimaryButton } from '../components/PrimaryButton';
import { RoleSelector } from '../components/RoleSelector';

export default function Registro() {
  const [rol, setRol] = useState<'comprador' | 'vendedor'>('comprador');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Seller specific fields
  const [nombreComercial, setNombreComercial] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [telefonoNegocio, setTelefonoNegocio] = useState('');
  const [direccion, setDireccion] = useState('');

  const registrar = async () => {
    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      Alert.alert('Campos incompletos', 'Completa los campos obligatorios personales.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    if (rol === 'vendedor') {
      if (!nombreComercial || !telefonoNegocio || !direccion) {
        Alert.alert('Campos incompletos', 'Completa los campos obligatorios del negocio.');
        return;
      }
    }

    try {
      const payload: any = {
        nombre,
        apellido,
        email,
        telefono,
        password,
        tipo_cuenta: rol,
      };

      if (rol === 'vendedor') {
        payload.nombre_comercial = nombreComercial;
        payload.descripcion = descripcion;
        payload.telefono_negocio = telefonoNegocio;
        payload.direccion = direccion;
      }

      const respuesta = await fetch(
        'https://lubbi.onrender.com/api/usuarios',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        Alert.alert('Error', datos.mensaje || 'No se pudo registrar.');
        return;
      }

      Alert.alert('Registro exitoso', 'Tu cuenta fue creada correctamente.');
      router.replace('/login');
    } catch (error) {
      console.error(error);
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor.');
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
            <Text style={styles.subtitulo}>Regístrate</Text>
          </View>

          <View style={styles.formContainer}>
            <RoleSelector rol={rol} setRol={setRol} />

            <Text style={styles.sectionTitle}>Datos Personales</Text>
            <InputField label="Nombre *" placeholder="Tu nombre" value={nombre} onChangeText={setNombre} />
            <InputField label="Apellido *" placeholder="Tu apellido" value={apellido} onChangeText={setApellido} />
            <InputField label="Correo electrónico *" placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <InputField label="Teléfono" placeholder="Número de celular" keyboardType="phone-pad" value={telefono} onChangeText={setTelefono} />
            <InputField label="Contraseña *" placeholder="Mínimo 6 caracteres" secureTextEntry value={password} onChangeText={setPassword} />
            <InputField label="Confirmar Contraseña *" placeholder="Mínimo 6 caracteres" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />

            {rol === 'vendedor' && (
              <>
                <Text style={styles.sectionTitle}>Datos del Negocio</Text>
                <InputField label="Nombre comercial *" placeholder="Nombre de tu negocio" value={nombreComercial} onChangeText={setNombreComercial} />
                <InputField label="Descripción" placeholder="Ej: Venta de lubricantes" value={descripcion} onChangeText={setDescripcion} />
                <InputField label="Teléfono del Negocio *" placeholder="Teléfono" keyboardType="phone-pad" value={telefonoNegocio} onChangeText={setTelefonoNegocio} />
                <InputField label="Dirección *" placeholder="Dirección del negocio" value={direccion} onChangeText={setDireccion} />
              </>
            )}

            <PrimaryButton texto="Registrarme" onPress={registrar} buttonStyle={styles.registerBoton} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerTexto}>¿Ya tienes cuenta? </Text>
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
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: '#0A1628', padding: 24, justifyContent: 'center' },
  header: { marginTop: 40, marginBottom: 30, alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: 12 },
  titulo: { color: '#FFD700', fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitulo: { color: '#4A90D9', fontSize: 16 },
  formContainer: { flex: 1 },
  sectionTitle: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  registerBoton: { marginTop: 16, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, marginBottom: 30 },
  footerTexto: { color: '#999999', fontSize: 15 },
  loginEnlace: { color: '#FFD700', fontSize: 15, fontWeight: 'bold' }
});
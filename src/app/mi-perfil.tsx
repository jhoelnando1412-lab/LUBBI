import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { obtenerSesion } from '../utils/session';

export default function MiPerfil() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [rol, setRol] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const cargar = async () => {
      const sesion = await obtenerSesion();
      if (!sesion) return;
      setUsuarioId(sesion.usuario_id);
      try {
        const res = await fetch(`https://lubbi.onrender.com/api/perfil/${sesion.usuario_id}`);
        const data = await res.json();
        setNombre(data.nombre || '');
        setApellido(data.apellido || '');
        setEmail(data.email || '');
        setTelefono(data.telefono || '');
        setRol(data.rol || sesion.rol);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const guardar = async () => {
    if (!nombre || !apellido) {
      Alert.alert('Error', 'Nombre y apellido son obligatorios.');
      return;
    }
    setGuardando(true);
    try {
      const res = await fetch(`https://lubbi.onrender.com/api/perfil/${usuarioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, telefono }),
      });
      if (res.ok) {
        Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      } else {
        Alert.alert('Error', 'No se pudo actualizar el perfil.');
      }
    } catch (e) {
      Alert.alert('Error de conexión', 'No se pudo conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return (
    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator color="#4A90D9" size="large" />
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{nombre.charAt(0)}{apellido.charAt(0)}</Text>
          </View>
          <Text style={styles.nombreCompleto}>{nombre} {apellido}</Text>
          <View style={styles.rolBadge}>
            <Text style={styles.rolText}>{rol === 'vendedor' ? 'Vendedor' : 'Comprador'}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nombre</Text>
          <TextInput style={styles.input} value={nombre} onChangeText={setNombre} placeholderTextColor="#666" placeholder="Tu nombre" />

          <Text style={styles.label}>Apellido</Text>
          <TextInput style={styles.input} value={apellido} onChangeText={setApellido} placeholderTextColor="#666" placeholder="Tu apellido" />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput style={[styles.input, styles.inputDisabled]} value={email} editable={false} />
          <Text style={styles.hint}>El email no se puede modificar.</Text>

          <Text style={styles.label}>Teléfono</Text>
          <TextInput style={styles.input} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" placeholderTextColor="#666" placeholder="Tu teléfono" />

          <TouchableOpacity style={styles.saveBtn} onPress={guardar} disabled={guardando}>
            {guardando ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Guardar cambios</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#0D1F3C' },
  backBtn: { marginRight: 12, width: 36, height: 36, backgroundColor: '#1C2E4A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#4A90D9', fontSize: 20, fontWeight: 'bold' },
  titulo: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  content: { padding: 24, paddingBottom: 40 },
  avatarContainer: { alignItems: 'center', marginBottom: 32 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1C2E4A', borderWidth: 3, borderColor: '#4A90D9', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#FFD700', fontSize: 28, fontWeight: 'bold' },
  nombreCompleto: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  rolBadge: { backgroundColor: '#4A90D9' + '22', borderWidth: 1, borderColor: '#4A90D9', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20 },
  rolText: { color: '#4A90D9', fontSize: 13, fontWeight: 'bold' },
  form: {},
  label: { color: '#999', fontSize: 13, marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#1C2E4A', borderWidth: 1, borderColor: '#2A4A6B', borderRadius: 10, padding: 14, color: '#fff', fontSize: 15 },
  inputDisabled: { opacity: 0.5 },
  hint: { color: '#555', fontSize: 12, marginTop: 4 },
  saveBtn: { backgroundColor: '#4A90D9', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 28 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

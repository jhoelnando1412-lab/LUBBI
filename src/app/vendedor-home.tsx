import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { obtenerSesion, cerrarSesion, Sesion } from '../utils/session';
import { LubbiDrawer } from '../components/LubbiDrawer';

export default function VendedorHome() {
  const [usuario, setUsuario] = useState<Sesion | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const sesion = await obtenerSesion();
      setUsuario(sesion);
    };
    loadSession();
  }, []);

  const handleLogout = async () => {
    await cerrarSesion();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <LubbiDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} sesion={usuario} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.menuBtn}>
            <Text style={styles.menuBtnText}>☰</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.titulo}>LUBBI</Text>
            <Text style={styles.subtitulo}>Hola, {usuario?.nombre} 🏢</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutTexto}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.rol}>Panel de Vendedor</Text>

      <View style={styles.grid}>
        {[
          { icono: '📦', label: 'Mis productos', ruta: '/vendedor-productos' },
          { icono: '📊', label: 'Inventario', ruta: '/vendedor-inventario' },
          { icono: '🛒', label: 'Ventas', ruta: '/vendedor-ventas' },
          { icono: '📋', label: 'Reservas', ruta: '/vendedor-reservas' },
          { icono: '💬', label: 'Chat', ruta: '/conversaciones' },
          { icono: '🔔', label: 'Notificaciones', ruta: '/notificaciones' },
        ].map(item => (
          <TouchableOpacity
            key={item.label}
            style={styles.gridItem}
            onPress={() => router.push(item.ruta as any)}
          >
            <Text style={styles.gridIcon}>{item.icono}</Text>
            <Text style={styles.gridLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628', paddingTop: 60, paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuBtn: { width: 38, height: 38, backgroundColor: '#1C2E4A', borderRadius: 10, borderWidth: 1, borderColor: '#4A90D9', alignItems: 'center', justifyContent: 'center' },
  menuBtnText: { color: '#4A90D9', fontSize: 18, lineHeight: 22 },
  titulo: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
  subtitulo: { color: '#4A90D9', fontSize: 13 },
  logoutBtn: { backgroundColor: '#1C2E4A', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#4A90D9' },
  logoutTexto: { color: '#4A90D9', fontSize: 13 },
  rol: { color: '#999', fontSize: 14, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%', backgroundColor: '#1C2E4A', borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#2A4A6B' },
  gridIcon: { fontSize: 32, marginBottom: 8 },
  gridLabel: { color: '#fff', fontSize: 14, fontWeight: '600', textAlign: 'center' },
});

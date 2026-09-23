import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const pantallasVendedor = [
  { icono: '📦', label: 'Mis productos', ruta: '/vendedor-productos' },
  { icono: '📊', label: 'Inventario', ruta: '/vendedor-inventario' },
  { icono: '🛒', label: 'Ventas', ruta: '/vendedor-ventas' },
  { icono: '📋', label: 'Reservas', ruta: '/vendedor-reservas' },
];

function PlaceholderScreen({ titulo, icono }: { titulo: string; icono: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>{titulo}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.icon}>{icono}</Text>
        <Text style={styles.msg}>Esta sección está en desarrollo.</Text>
        <Text style={styles.sub}>Próximamente podrás gestionar esta área desde aquí.</Text>
      </View>
    </View>
  );
}

export function VendedorProductos() { return <PlaceholderScreen titulo="Mis Productos" icono="📦" />; }
export function VendedorInventario() { return <PlaceholderScreen titulo="Inventario" icono="📊" />; }
export function VendedorVentas() { return <PlaceholderScreen titulo="Ventas" icono="🛒" />; }
export function VendedorReservas() { return <PlaceholderScreen titulo="Reservas Recibidas" icono="📋" />; }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#0D1F3C' },
  backBtn: { marginRight: 12, width: 36, height: 36, backgroundColor: '#1C2E4A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#4A90D9', fontSize: 20, fontWeight: 'bold' },
  titulo: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  body: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  icon: { fontSize: 70, marginBottom: 20 },
  msg: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  sub: { color: '#999', fontSize: 14, textAlign: 'center', lineHeight: 22 },
});

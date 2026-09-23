import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { obtenerSesion } from '../utils/session';

interface Favorito {
  id: string;
  producto_nombre: string;
  marca: string;
  nombre_comercial: string;
}

export default function Favoritos() {
  const [items, setItems] = useState<Favorito[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const sesion = await obtenerSesion();
      if (!sesion) return;
      try {
        const res = await fetch(`http://192.168.1.43:3000/api/perfil/${sesion.usuario_id}/favoritos`);
        const data = await res.json();
        setItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Favoritos</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color="#4A90D9" size="large" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyText}>Aún no tienes favoritos guardados</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemIcon}>🛢️</Text>
              <View style={styles.info}>
                <Text style={styles.nombre}>{item.producto_nombre || 'Vendedor'}</Text>
                {item.marca && <Text style={styles.detalle}>{item.marca}</Text>}
                {item.nombre_comercial && <Text style={styles.detalle}>📍 {item.nombre_comercial}</Text>}
              </View>
              <Text style={styles.heart}>❤️</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#0D1F3C' },
  backBtn: { marginRight: 12, width: 36, height: 36, backgroundColor: '#1C2E4A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#4A90D9', fontSize: 20, fontWeight: 'bold' },
  titulo: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: '#999', fontSize: 16, textAlign: 'center' },
  card: { backgroundColor: '#1C2E4A', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A4A6B' },
  itemIcon: { fontSize: 28, marginRight: 14 },
  info: { flex: 1 },
  nombre: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 3 },
  detalle: { color: '#999', fontSize: 13 },
  heart: { fontSize: 20 },
});

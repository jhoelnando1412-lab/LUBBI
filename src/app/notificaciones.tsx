import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { obtenerSesion } from '../utils/session';

interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  created_at: string;
}

export default function Notificaciones() {
  const [items, setItems] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const sesion = await obtenerSesion();
      if (!sesion) return;
      try {
        const res = await fetch(`https://lubbi.onrender.com/api/perfil/${sesion.usuario_id}/notificaciones`);
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

  const marcarLeida = async (id: string) => {
    try {
      await fetch(`https://lubbi.onrender.com/api/perfil/notificaciones/${id}/leida`, { method: 'PUT' });
      setItems(prev => prev.map(n => n.id === id ? { ...n, leida: true } : n));
    } catch (e) { /* silent */ }
  };

  const tipoIcon = (tipo: string) => {
    if (tipo === 'pedido') return '🛒';
    if (tipo === 'reserva') return '📋';
    if (tipo === 'chat') return '💬';
    return '🔔';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Notificaciones</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color="#4A90D9" size="large" style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔔</Text>
          <Text style={styles.emptyText}>Sin notificaciones</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.leida && styles.cardNoLeida]}
              onPress={() => marcarLeida(item.id)}
            >
              <View style={styles.row}>
                <Text style={styles.icon}>{tipoIcon(item.tipo)}</Text>
                <View style={styles.content}>
                  <Text style={styles.cardTitulo}>{item.titulo}</Text>
                  <Text style={styles.cardMensaje}>{item.mensaje}</Text>
                  <Text style={styles.fecha}>{new Date(item.created_at).toLocaleDateString()}</Text>
                </View>
                {!item.leida && <View style={styles.dot} />}
              </View>
            </TouchableOpacity>
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
  emptyText: { color: '#999', fontSize: 16 },
  card: { backgroundColor: '#1C2E4A', borderRadius: 14, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2A4A6B' },
  cardNoLeida: { borderColor: '#4A90D9', borderLeftWidth: 4, borderLeftColor: '#4A90D9' },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  icon: { fontSize: 24, marginRight: 12, marginTop: 2 },
  content: { flex: 1 },
  cardTitulo: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 4 },
  cardMensaje: { color: '#999', fontSize: 13, marginBottom: 4 },
  fecha: { color: '#555', fontSize: 12 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4A90D9', marginTop: 4 },
});

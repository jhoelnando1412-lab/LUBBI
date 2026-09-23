import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { obtenerSesion } from '../utils/session';

interface Pedido {
  id: string;
  numero_pedido: string;
  estado: string;
  total: string;
  created_at: string;
  vendedor: string;
  productos: { nombre: string; marca: string; cantidad: number; subtotal: string }[];
}

export default function MisCompras() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const sesion = await obtenerSesion();
      if (!sesion) return;
      try {
        const res = await fetch(`http://192.168.1.43:3000/api/perfil/${sesion.usuario_id}/pedidos`);
        const data = await res.json();
        setPedidos(data);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const estadoColor = (estado: string) => {
    if (estado === 'Entregado') return '#4CAF50';
    if (estado === 'Cancelado') return '#FF6B6B';
    if (estado === 'Pendiente') return '#FFD700';
    return '#4A90D9';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Mis Compras</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color="#4A90D9" size="large" style={{ marginTop: 40 }} />
      ) : pedidos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Aún no tienes compras registradas</Text>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.numeroPedido}>{item.numero_pedido}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: estadoColor(item.estado) + '22', borderColor: estadoColor(item.estado) }]}>
                  <Text style={[styles.estadoText, { color: estadoColor(item.estado) }]}>{item.estado}</Text>
                </View>
              </View>
              <Text style={styles.vendedor}>📍 {item.vendedor}</Text>
              <Text style={styles.fecha}>🗓 {new Date(item.created_at).toLocaleDateString()}</Text>
              {item.productos?.map((p, i) => (
                <Text key={i} style={styles.producto}>• {p.nombre} ({p.marca}) × {p.cantidad}</Text>
              ))}
              <Text style={styles.total}>Total: <Text style={styles.totalValue}>Bs. {parseFloat(item.total).toFixed(2)}</Text></Text>
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
  card: { backgroundColor: '#1C2E4A', borderRadius: 14, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#2A4A6B' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  numeroPedido: { color: '#4A90D9', fontWeight: 'bold', fontSize: 14 },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  estadoText: { fontSize: 12, fontWeight: 'bold' },
  vendedor: { color: '#999', fontSize: 13, marginBottom: 3 },
  fecha: { color: '#999', fontSize: 13, marginBottom: 8 },
  producto: { color: '#fff', fontSize: 13, marginBottom: 3 },
  total: { color: '#999', fontSize: 14, marginTop: 8 },
  totalValue: { color: '#FFD700', fontWeight: 'bold' },
});

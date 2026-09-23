import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { obtenerSesion } from '../utils/session';

interface Reserva {
  id: string;
  codigo_reserva: string;
  estado: string;
  monto: string;
  fecha_reserva: string;
  fecha_expiracion?: string;
  numero_pedido: string;
  vendedor: string;
  productos: { nombre: string; marca: string; cantidad: number }[];
}

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      const sesion = await obtenerSesion();
      if (!sesion) return;
      try {
        const res = await fetch(`https://lubbi.onrender.com/api/perfil/${sesion.usuario_id}/reservas`);
        const data = await res.json();
        setReservas(data);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const estadoColor = (estado: string) => {
    if (estado?.includes('Confirmad')) return '#4CAF50';
    if (estado?.includes('Cancelad') || estado?.includes('Expirad')) return '#FF6B6B';
    return '#FFD700';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Mis Reservas</Text>
      </View>

      {cargando ? (
        <ActivityIndicator color="#4A90D9" size="large" style={{ marginTop: 40 }} />
      ) : reservas.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Aún no tienes reservas registradas</Text>
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.codigo}>{item.codigo_reserva}</Text>
                <View style={[styles.estadoBadge, { backgroundColor: estadoColor(item.estado) + '22', borderColor: estadoColor(item.estado) }]}>
                  <Text style={[styles.estadoText, { color: estadoColor(item.estado) }]}>{item.estado}</Text>
                </View>
              </View>
              <Text style={styles.vendedor}>🏪 {item.vendedor}</Text>
              <Text style={styles.fecha}>🗓 {new Date(item.fecha_reserva).toLocaleDateString()}</Text>
              {item.fecha_expiracion && (
                <Text style={styles.expira}>⏰ Expira: {new Date(item.fecha_expiracion).toLocaleDateString()}</Text>
              )}
              {item.productos?.map((p, i) => (
                <Text key={i} style={styles.producto}>• {p.nombre} ({p.marca}) × {p.cantidad}</Text>
              ))}
              <Text style={styles.monto}>Monto: <Text style={styles.montoValue}>Bs. {parseFloat(item.monto).toFixed(2)}</Text></Text>
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
  codigo: { color: '#4A90D9', fontWeight: 'bold', fontSize: 14 },
  estadoBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, borderWidth: 1 },
  estadoText: { fontSize: 12, fontWeight: 'bold' },
  vendedor: { color: '#fff', fontSize: 13, marginBottom: 3 },
  fecha: { color: '#999', fontSize: 13, marginBottom: 3 },
  expira: { color: '#FF6B6B', fontSize: 12, marginBottom: 8 },
  producto: { color: '#fff', fontSize: 13, marginBottom: 3 },
  monto: { color: '#999', fontSize: 14, marginTop: 8 },
  montoValue: { color: '#FFD700', fontWeight: 'bold' },
});

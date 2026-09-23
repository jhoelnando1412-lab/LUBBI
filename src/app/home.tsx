import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';

interface Tienda {
  id: number;
  nombre_comercial: string;
  descripcion: string;
  telefono: string;
  direccion: string;
  cantidad_productos: string;
  precio_minimo: string;
}

export default function Home() {
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://192.168.1.43:3000/api/tiendas')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar tiendas');
        return res.json();
      })
      .then(data => {
        setTiendas(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const renderTienda = ({ item }: { item: Tienda }) => (
    <View style={styles.card}>
      <Text style={styles.nombre}>{item.nombre_comercial}</Text>
      <Text style={styles.direccion}>📍 {item.direccion}</Text>
      <Text style={styles.info}>📞 {item.telefono}</Text>
      <Text style={styles.info}>📦 Productos disponibles: {item.cantidad_productos}</Text>
      <Text style={styles.info}>💰 Desde: Bs. {parseFloat(item.precio_minimo).toFixed(2)}</Text>
      <TouchableOpacity 
        style={styles.boton}
        onPress={() => router.push({ pathname: '/tienda', params: { id: item.id, nombre: item.nombre_comercial, telefono: item.telefono } } as any)}
      >
        <Text style={styles.textoBoton}>Ver productos</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tiendas Disponibles</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={tiendas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTienda}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    padding: 16,
    paddingTop: 50,
  },
  titulo: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loader: {
    marginTop: 40,
  },
  error: {
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1C2E4A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90D9',
  },
  nombre: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  direccion: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 4,
  },
  info: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
  },
  boton: {
    backgroundColor: '#4A90D9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableOpacity, Linking, Alert } from 'react-native';

interface Producto {
  nombre: string;
  marca: string;
  viscosidad: string;
  presentacion: string;
  precio: string;
  stock: number;
  categoria: string;
}

const BRAND_LOGOS: Record<string, string> = {
  'Mobil': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Mobil_logo.svg/320px-Mobil_logo.svg.png',
  'Castrol': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Castrol_logo.svg/320px-Castrol_logo.svg.png',
  'Shell': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Shell_logo.svg/320px-Shell_logo.svg.png',
  'Valvoline': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Valvoline_logo.svg/320px-Valvoline_logo.svg.png'
};

export default function TiendaDetail() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const nombreTienda = params.nombre as string;
  const telefono = params.telefono as string;

  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://192.168.1.43:3000/api/tiendas/${id}/productos`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar productos');
        return res.json();
      })
      .then(data => {
        setProductos(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const contactarWhatsApp = () => {
    if (!telefono) {
      Alert.alert('Error', 'No hay número de teléfono disponible.');
      return;
    }
    const url = `https://wa.me/591${telefono}`;
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'No se puede abrir WhatsApp');
      }
    });
  };

  const renderProducto = ({ item }: { item: Producto }) => {
    const imageUrl = BRAND_LOGOS[item.marca];
    const stockColor = item.stock > 0 ? '#4CAF50' : '#F44336'; // Verde / Rojo
    
    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.logo} 
              resizeMode="contain" 
            />
          ) : (
            <Text style={styles.emoji}>🛢️</Text>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nombre}>{item.nombre} - {item.marca}</Text>
          <Text style={styles.detalle}>{item.categoria}</Text>
          <Text style={styles.detalle}>Viscosidad: {item.viscosidad} | {item.presentacion} L</Text>
          <Text style={styles.precio}>Bs. {parseFloat(item.precio).toFixed(2)}</Text>
          <Text style={[styles.stock, { color: stockColor }]}>
            {item.stock > 0 ? `Stock disponible: ${item.stock}` : 'Agotado'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{nombreTienda}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFD700" style={styles.loader} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={productos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderProducto}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No hay productos disponibles</Text>}
        />
      )}

      <TouchableOpacity style={styles.whatsappButton} onPress={contactarWhatsApp}>
        <Text style={styles.whatsappText}>Contactar por WhatsApp</Text>
      </TouchableOpacity>
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
  empty: {
    color: '#999999',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  list: {
    paddingBottom: 80, // Espacio para el botón fijo abajo
  },
  card: {
    backgroundColor: '#1C2E4A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4A90D9',
  },
  imageContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 16,
    padding: 4,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  emoji: {
    fontSize: 32,
  },
  infoContainer: {
    flex: 1,
  },
  nombre: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detalle: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 2,
  },
  precio: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  stock: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#4CAF50', // Color verde característico de WhatsApp
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  whatsappText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  }
});

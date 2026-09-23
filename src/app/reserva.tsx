import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { LubbiLogo } from '../components/LubbiLogo';
import { obtenerSesion } from '../utils/session';

export default function Reserva() {
  const params = useLocalSearchParams();
  const producto_id = params.producto_id as string;
  const nombre = params.nombre as string;
  const marca = params.marca as string;
  const precio = parseFloat((params.precio as string) || '0');
  const vendedor_id = params.vendedor_id as string;
  const nombre_comercial = params.nombre_comercial as string;
  const direccion = params.direccion as string;

  const [cantidad, setCantidad] = useState(1);
  const [loading, setLoading] = useState(false);

  const subtotal = precio * cantidad;

  const confirmarReserva = async () => {
    setLoading(true);
    try {
      const sesion = await obtenerSesion();
      if (!sesion) {
        Alert.alert('Error', 'Debes iniciar sesión para reservar.');
        setLoading(false);
        return;
      }

      const res = await fetch('https://lubbi.onrender.com/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: sesion.usuario_id,
          vendedor_id,
          inventario_id: producto_id, // using producto_id as inventario_id based on previous mapping
          cantidad,
          precio_unitario: precio,
          total: subtotal
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || 'Error al procesar reserva');
      }

      // Ir a la pantalla de confirmación
      router.replace({
        pathname: '/reserva-confirmacion',
        params: {
          codigo: data.reserva.codigo_reserva,
          producto: `${nombre} - ${marca}`,
          cantidad: cantidad.toString(),
          total: subtotal.toString(),
          vendedor: nombre_comercial,
          estado: data.reserva.estado
        }
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <LubbiLogo size={80} />
        <Text style={styles.titulo}>Reservar producto</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Detalles del Producto</Text>
        <Text style={styles.textoLabel}>Producto: <Text style={styles.textoValor}>{nombre}</Text></Text>
        <Text style={styles.textoLabel}>Marca: <Text style={styles.textoValor}>{marca}</Text></Text>
        <Text style={styles.textoLabel}>Precio: <Text style={styles.textoValor}>Bs. {precio.toFixed(2)}</Text></Text>

        <View style={styles.cantidadContainer}>
          <Text style={styles.textoLabel}>Cantidad:</Text>
          <View style={styles.counter}>
            <TouchableOpacity onPress={() => setCantidad(Math.max(1, cantidad - 1))} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{cantidad}</Text>
            <TouchableOpacity onPress={() => setCantidad(cantidad + 1)} style={styles.counterBtn}>
              <Text style={styles.counterBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.textoLabel}>Subtotal: <Text style={styles.textoResaltado}>Bs. {subtotal.toFixed(2)}</Text></Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Datos del Vendedor</Text>
        <Text style={styles.textoLabel}>Negocio: <Text style={styles.textoValor}>{nombre_comercial}</Text></Text>
        <Text style={styles.textoLabel}>Dirección: <Text style={styles.textoValor}>{direccion}</Text></Text>
        <Text style={styles.textoLabel}>Fecha: <Text style={styles.textoValor}>{new Date().toLocaleDateString()}</Text></Text>
        <Text style={styles.textoLabel}>Estado: <Text style={styles.textoResaltado}>Pendiente de pago</Text></Text>
      </View>

      <View style={styles.qrCard}>
        <Text style={styles.sectionTitle}>Pagar mediante QR</Text>
        <Image
          source={require('../../assets/images/qr.jpeg')}
          style={styles.qrImage}
          resizeMode="contain"
        />
        <Text style={styles.qrTexto}>Escanea el código QR para realizar el pago</Text>
        <Text style={styles.qrTextoSecundario}>Transferencia directa a cuenta del vendedor</Text>
      </View>

      <TouchableOpacity
        style={styles.confirmarBtn}
        onPress={confirmarReserva}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.confirmarTexto}>Confirmar reserva</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelarBtn}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.cancelarTexto}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titulo: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#1C2E4A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A4A6B',
  },
  sectionTitle: {
    color: '#4A90D9',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2A4A6B',
    paddingBottom: 8,
  },
  textoLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 6,
  },
  textoValor: {
    color: '#fff',
    fontWeight: 'bold',
  },
  textoResaltado: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A1628',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90D9',
  },
  counterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  counterBtnText: {
    color: '#4A90D9',
    fontSize: 18,
    fontWeight: 'bold',
  },
  counterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
  },
  qrCard: {
    backgroundColor: '#1C2E4A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#4A90D9',
    alignItems: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
  },
  qrTexto: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  qrTextoSecundario: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  confirmarBtn: {
    backgroundColor: '#4A90D9',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelarBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
  },
  cancelarTexto: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LubbiLogo } from '../components/LubbiLogo';

export default function ReservaConfirmacion() {
  const params = useLocalSearchParams();
  const codigo = params.codigo as string;
  const producto = params.producto as string;
  const cantidad = params.cantidad as string;
  const total = params.total as string;
  const vendedor = params.vendedor as string;
  const estado = params.estado as string;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <LubbiLogo size={100} />
        <Text style={styles.titulo}>¡Reserva Confirmada!</Text>
        <Text style={styles.subtitulo}>Tu reserva ha sido registrada correctamente.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.codigoContainer}>
          <Text style={styles.codigoLabel}>Código de Reserva:</Text>
          <Text style={styles.codigoValor}>{codigo}</Text>
        </View>

        <Text style={styles.textoLabel}>Producto: <Text style={styles.textoValor}>{producto}</Text></Text>
        <Text style={styles.textoLabel}>Cantidad: <Text style={styles.textoValor}>{cantidad}</Text></Text>
        <Text style={styles.textoLabel}>Total a pagar: <Text style={styles.textoResaltado}>Bs. {total}</Text></Text>
        <Text style={styles.textoLabel}>Vendedor: <Text style={styles.textoValor}>{vendedor}</Text></Text>
        <Text style={styles.textoLabel}>Estado: <Text style={styles.estadoValor}>{estado}</Text></Text>
      </View>

      <TouchableOpacity 
        style={styles.verBtn}
        onPress={() => {
          // Navigate to a reservations list or something if it existed
          // For now just alert or go back
          router.replace('/cliente-home');
        }}
      >
        <Text style={styles.verTexto}>Ver mi reserva</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.inicioBtn}
        onPress={() => router.replace('/cliente-home')}
      >
        <Text style={styles.inicioTexto}>Volver al inicio</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titulo: {
    color: '#4CAF50',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitulo: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1C2E4A',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#4A90D9',
    width: '100%',
  },
  codigoContainer: {
    backgroundColor: '#0A1628',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  codigoLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  codigoValor: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  textoLabel: {
    color: '#999',
    fontSize: 14,
    marginBottom: 10,
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
  estadoValor: {
    color: '#4A90D9',
    fontWeight: 'bold',
  },
  verBtn: {
    backgroundColor: '#4A90D9',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  verTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inicioBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#999',
    width: '100%',
  },
  inicioTexto: {
    color: '#999',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

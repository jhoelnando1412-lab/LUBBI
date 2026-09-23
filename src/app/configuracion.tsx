import { router } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const opciones = [
  { icono: '🔔', label: 'Notificaciones', accion: () => {} },
  { icono: 'ℹ️', label: 'Acerca de LUBBI', accion: () => {} },
  { icono: '📄', label: 'Términos y condiciones', accion: () => {} },
  { icono: '🔒', label: 'Política de privacidad', accion: () => {} },
  { icono: '📧', label: 'Contacto y soporte', accion: () => Linking.openURL('mailto:soporte@lubbi.bo') },
];

export default function Configuracion() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Configuración</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.version}>LUBBI v1.0.0 · Santa Cruz, Bolivia</Text>

        {opciones.map(op => (
          <TouchableOpacity key={op.label} style={styles.item} onPress={op.accion}>
            <Text style={styles.itemIcon}>{op.icono}</Text>
            <Text style={styles.itemLabel}>{op.label}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Sobre LUBBI</Text>
          <Text style={styles.infoText}>
            LUBBI es una plataforma para buscar, comparar y reservar lubricantes para vehículos livianos en Santa Cruz de la Sierra, Bolivia.
          </Text>
          <Text style={styles.infoText}>
            El lubricante que necesitas, donde estás.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#0D1F3C' },
  backBtn: { marginRight: 12, width: 36, height: 36, backgroundColor: '#1C2E4A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  backText: { color: '#4A90D9', fontSize: 20, fontWeight: 'bold' },
  titulo: { color: '#FFD700', fontSize: 22, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  version: { color: '#555', fontSize: 13, textAlign: 'center', marginBottom: 24 },
  item: { backgroundColor: '#1C2E4A', borderRadius: 12, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A4A6B' },
  itemIcon: { fontSize: 22, width: 36 },
  itemLabel: { color: '#fff', fontSize: 15, flex: 1 },
  arrow: { color: '#4A90D9', fontSize: 22 },
  infoBox: { backgroundColor: '#1C2E4A', borderRadius: 16, padding: 20, marginTop: 16, borderWidth: 1, borderColor: '#2A4A6B' },
  infoTitle: { color: '#FFD700', fontWeight: 'bold', fontSize: 16, marginBottom: 12 },
  infoText: { color: '#999', fontSize: 14, marginBottom: 8, lineHeight: 20 },
});

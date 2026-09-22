import { ThemedText } from '@/components/themed-text';
import { useState } from 'react';
import {
    FlatList,
    Linking,
    StatusBar,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const vendedores = [
  {
    id: '1',
    nombre: 'Lubricentro Don Roberto',
    producto: 'Aceite 20W-50',
    marca: 'Mobil',
    precio: 'Bs. 280',
    distancia: '1.2 km',
    stock: 'Disponible',
    telefono: '59170000001',
    zona: 'Plan 3000',
  },
  {
    id: '2',
    nombre: 'Distribuidora El Motor',
    producto: 'Aceite 5W-30',
    marca: 'Castrol',
    precio: 'Bs. 320',
    distancia: '2.5 km',
    stock: 'Disponible',
    telefono: '59170000002',
    zona: 'Equipetrol',
  },
  {
    id: '3',
    nombre: 'Lubricantes Santa Cruz',
    producto: 'Aceite 10W-40',
    marca: 'Shell',
    precio: 'Bs. 300',
    distancia: '3.1 km',
    stock: 'Últimas unidades',
    telefono: '59170000003',
    zona: 'Av. Cristo Redentor',
  },
  {
    id: '4',
    nombre: 'AutoLub Express',
    producto: 'Aceite 15W-40',
    marca: 'Valvoline',
    precio: 'Bs. 260',
    distancia: '4.0 km',
    stock: 'Disponible',
    telefono: '59170000004',
    zona: 'Villa 1ro de Mayo',
  },
];

const abrirWhatsApp = (telefono: string) => {
  Linking.openURL(`https://wa.me/${telefono}`);
};

export default function HomeScreen() {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = vendedores.filter(
    (v) =>
      v.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
      v.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <ThemedText style={styles.headerTitulo}>LUBBI</ThemedText>
          <ThemedText style={styles.headerSubtitulo}>Santa Cruz de la Sierra</ThemedText>
        </View>
        <View style={styles.headerBadge}>
          <ThemedText style={styles.headerBadgeTexto}>{filtrados.length} vendedores</ThemedText>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.buscadorContainer}>
        <TextInput
          style={styles.buscador}
          placeholder="🔍  Buscar por producto, marca o vendedor..."
          placeholderTextColor="#999"
          value={busqueda}
          onChangeText={setBusqueda}
        />
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtrosContainer}>
        {['Todos', 'Mobil', 'Castrol', 'Shell', 'Valvoline'].map((f) => (
          <TouchableOpacity key={f} style={styles.filtroBoton}>
            <ThemedText style={styles.filtroTexto}>{f}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <ThemedText style={styles.vacioTexto}>No se encontraron resultados</ThemedText>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Header card */}
            <View style={styles.cardHeader}>
              <View style={styles.cardIcono}>
                <ThemedText style={styles.cardIconoTexto}>🛢️</ThemedText>
              </View>
              <View style={styles.cardHeaderInfo}>
                <ThemedText style={styles.cardNombre}>{item.nombre}</ThemedText>
                <ThemedText style={styles.cardZona}>📍 {item.zona}</ThemedText>
              </View>
              <ThemedText style={styles.cardDistancia}>{item.distancia}</ThemedText>
            </View>

            {/* Info producto */}
            <View style={styles.cardProducto}>
              <ThemedText style={styles.cardProductoTexto}>
                {item.producto} — {item.marca}
              </ThemedText>
            </View>

            {/* Tags */}
            <View style={styles.cardTags}>
              <View style={styles.tagPrecio}>
                <ThemedText style={styles.tagTexto}>{item.precio}</ThemedText>
              </View>
              <View style={[styles.tagStock, item.stock === 'Disponible' ? styles.tagVerde : styles.tagNaranja]}>
                <ThemedText style={styles.tagTexto}>{item.stock}</ThemedText>
              </View>
            </View>

            {/* Botón WhatsApp */}
            <TouchableOpacity
              style={styles.botonWhatsapp}
              onPress={() => abrirWhatsApp(item.telefono)}>
              <ThemedText style={styles.botonTexto}>💬  Contactar por WhatsApp</ThemedText>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0A1628',
  },
  headerTitulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  headerSubtitulo: {
    fontSize: 12,
    color: '#4A90D9',
  },
  headerBadge: {
    backgroundColor: '#4A90D9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  headerBadgeTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buscadorContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0A1628',
  },
  buscador: {
    backgroundColor: '#1C2E4A',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4A90D9',
  },
  filtrosContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  filtroBoton: {
    backgroundColor: '#1C2E4A',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#4A90D9',
  },
  filtroTexto: {
    color: '#4A90D9',
    fontSize: 12,
  },
  lista: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#1C2E4A',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#2A4A6B',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardIcono: {
    width: 44,
    height: 44,
    backgroundColor: '#0A1628',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconoTexto: {
    fontSize: 22,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardNombre: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  cardZona: {
    color: '#4A90D9',
    fontSize: 12,
  },
  cardDistancia: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardProducto: {
    backgroundColor: '#0A1628',
    borderRadius: 8,
    padding: 8,
  },
  cardProductoTexto: {
    color: '#ccc',
    fontSize: 13,
  },
  cardTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tagPrecio: {
    backgroundColor: '#1a472a',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagStock: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagVerde: {
    backgroundColor: '#1a472a',
  },
  tagNaranja: {
    backgroundColor: '#7a3e00',
  },
  tagTexto: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  botonWhatsapp: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  botonTexto: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  vacio: {
    alignItems: 'center',
    paddingTop: 40,
  },
  vacioTexto: {
    color: '#999',
    fontSize: 16,
  },
}); 
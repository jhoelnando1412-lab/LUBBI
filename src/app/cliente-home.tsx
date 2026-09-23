import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image, ScrollView,
  StyleSheet, Text,
  TextInput, TouchableOpacity,
  View
} from 'react-native';
import { cerrarSesion, obtenerSesion, Sesion } from '../utils/session';
import { LubbiDrawer } from '../components/LubbiDrawer';

interface Producto {
  id: string;
  nombre: string;
  marca: string;
  descripcion: string;
  categoria: string;
  precio: string;
  stock: number;
  vendedor_id: string;
  nombre_comercial: string;
  direccion: string;
  telefono: string;
}

const imagenes: { [key: string]: any } = {
  'Castrol_CRB SAE 10W-40': require('../../assets/images/castrol CRB - sae 10w-40.jpeg'),
  'Castrol_Edge Aceite de Motor': require('../../assets/images/castrol edge - aceite de motor.jpeg'),
  'Shell_Helix HX7 10W-40': require('../../assets/images/shell helix - hx7 10w - 40.jpeg'),
  'Valvoline_Advance Aceite de Motor': require('../../assets/images/valvoline advance - aceite de motor.jpeg'),
  'Valvoline_Max-Life Aceite de Motor': require('../../assets/images/valvoline max-life - aceite de motor.jpeg'),
  'Mobil_Aceite de Caja': require('../../assets/images/mobil - aceite de caja.jpeg'),
  'Liqui Moly_Aceite de Caja': require('../../assets/images/liqui moly - aceite de caja.jpeg'),
  'Copec_Agua Verde Coolant': require('../../assets/images/copec - agua verde.jpeg'),
  'Copec_Coolant': require('../../assets/images/copec - coolant.jpeg'),
  'DOT_DOT3 Líquido de Frenos': require('../../assets/images/dot3 - liquido de frenos.jpeg'),
  'DOT_DOT5.1 Líquido de Frenos': require('../../assets/images/dot5.1 - liquido de frenos.jpeg'),
  'Liqui Moly_Engine Flush': require('../../assets/images/liqui moly - engine flush.jpeg'),
  'Liqui Moly_Limpiador de Inyectores': require('../../assets/images/liqui moly - limpiador de inyectores.jpeg'),
  'Raloy_Limpiador de Inyectores': require('../../assets/images/raloy - limpiador de inyectores.jpeg'),
  'STP_Tratamiento de Gasolina': require('../../assets/images/stp - tratamiento de gasolina.jpeg'),
  'Tirreno_Aditivo para Gasolina': require('../../assets/images/tirreno - aditivo para gasolina.jpeg'),
  'Vistony_Lubricante Multiuso': require('../../assets/images/vistony - lubricante multiuso.jpeg'),
};

const obtenerImagen = (marca: string, nombre: string) => {
  const key = `${marca}_${nombre}`;
  return imagenes[key] || null;
};

const categorias = ['Todos', 'Aceites de motor', 'Aceites de transmisión/caja', 'Refrigerantes', 'Líquido de frenos', 'Aditivos y limpiadores'];

export default function ClienteHome() {
  const [usuario, setUsuario] = useState<Sesion | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtrados, setFiltrados] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [cargando, setCargando] = useState(true);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const sesion = await obtenerSesion();
      setUsuario(sesion);
    };
    loadSession();
    cargarProductos();
  }, []);

  useEffect(() => {
    let resultado = productos;

    if (categoriaActiva !== 'Todos') {
      resultado = resultado.filter(p => p.categoria === categoriaActiva);
    }

    if (busqueda.trim() !== '') {
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.marca.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    setFiltrados(resultado);
  }, [busqueda, categoriaActiva, productos]);

  const cargarProductos = async () => {
    try {
      const res = await fetch('http://192.168.1.43:3000/api/productos');
      const data = await res.json();
      setProductos(data);
      setFiltrados(data);
    } catch (e) {
      console.error('Error cargando productos', e);
    } finally {
      setCargando(false);
    }
  };

  const handleLogout = async () => {
    await cerrarSesion();
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <LubbiDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} sesion={usuario} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.menuBtn}>
            <Text style={styles.menuBtnText}>☰</Text>
          </TouchableOpacity>
          <View>
            <Text style={styles.titulo}>LUBBI</Text>
            <Text style={styles.subtitulo}>Hola, {usuario?.nombre} 👋</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutTexto}>Salir</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <TextInput
        style={styles.buscador}
        placeholder="🔍 Buscar producto o marca..."
        placeholderTextColor="#999"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      {/* Filtros por categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosContainer}>
        {categorias.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.filtroBtn, categoriaActiva === cat && styles.filtroBtnActivo]}
            onPress={() => setCategoriaActiva(cat)}>
            <Text style={[styles.filtroTexto, categoriaActiva === cat && styles.filtroTextoActivo]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Contador */}
      <Text style={styles.contador}>{filtrados.length} productos disponibles</Text>

      {/* Lista */}
      {cargando ? (
        <ActivityIndicator size="large" color="#4A90D9" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.fila}
          ListEmptyComponent={
            <Text style={styles.vacio}>No se encontraron productos</Text>
          }
          renderItem={({ item }) => {
            const imagen = obtenerImagen(item.marca, item.nombre);
            return (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardTouchArea}
                  onPress={() => router.push({
                    pathname: '/tienda',
                    params: {
                      id: item.vendedor_id,
                      nombre: item.nombre_comercial,
                      telefono: item.telefono
                    }
                  })}>
                  {/* Imagen */}
                  <View style={styles.imagenContainer}>
                    {imagen ? (
                      <Image source={imagen} style={styles.imagen} resizeMode="contain" />
                    ) : (
                      <Text style={styles.imagenFallback}>🛢️</Text>
                    )}
                  </View>

                  {/* Info */}
                  <View style={styles.cardInfoContainer}>
                    <Text style={styles.cardMarca}>{item.marca}</Text>
                    <Text style={styles.cardNombre} numberOfLines={2}>{item.nombre}</Text>
                    <Text style={styles.cardPrecio}>Bs. {parseFloat(item.precio).toFixed(0)}</Text>
                    <Text style={styles.cardTienda} numberOfLines={1}>📍 {item.nombre_comercial}</Text>

                    {/* Stock */}
                    <View style={[styles.stockBadge, item.stock > 5 ? styles.stockVerde : styles.stockNaranja]}>
                      <Text style={styles.stockTexto}>Stock: {item.stock}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Botón Reservar fijo al fondo de la tarjeta */}
                <TouchableOpacity 
                  style={styles.reservarBtn}
                  onPress={() => router.push({
                    pathname: '/reserva',
                    params: {
                      producto_id: item.id,
                      nombre: item.nombre,
                      marca: item.marca,
                      precio: item.precio,
                      vendedor_id: item.vendedor_id,
                      nombre_comercial: item.nombre_comercial,
                      direccion: item.direccion
                    }
                  } as any)}
                >
                  <Text style={styles.reservarTexto}>Reservar</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1628',
    paddingTop: 60,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#1C2E4A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90D9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBtnText: {
    color: '#4A90D9',
    fontSize: 18,
    lineHeight: 22,
  },
  titulo: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitulo: {
    color: '#4A90D9',
    fontSize: 13,
  },
  logoutBtn: {
    backgroundColor: '#1C2E4A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4A90D9',
  },
  logoutTexto: {
    color: '#4A90D9',
    fontSize: 13,
  },
  buscador: {
    backgroundColor: '#1C2E4A',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#4A90D9',
    marginBottom: 10,
  },
  filtrosScroll: {
    marginBottom: 10,
    flexShrink: 0,
  },
  filtrosContainer: {
    gap: 8,
    paddingRight: 12,
    alignItems: 'center',
  },
  filtroBtn: {
    backgroundColor: '#1C2E4A',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#2A4A6B',
  },
  filtroBtnActivo: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  filtroTexto: {
    color: '#999',
    fontSize: 12,
  },
  filtroTextoActivo: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contador: {
    color: '#999',
    fontSize: 12,
    marginBottom: 10,
  },
  lista: {
    paddingBottom: 30,
  },
  fila: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#1C2E4A',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2A4A6B',
  },
  cardTouchArea: {
    // No flex:1 — let height grow naturally with content
  },
  cardInfoContainer: {
    // No flex:1 — let height grow naturally with content
    marginTop: 4,
  },
  imagenContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  imagen: {
    width: '90%',
    height: '90%',
  },
  imagenFallback: {
    fontSize: 40,
  },
  cardMarca: {
    color: '#4A90D9',
    fontSize: 11,
    fontWeight: 'bold',
  },
  cardNombre: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  cardPrecio: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: 'bold',
  },
  cardTienda: {
    color: '#999',
    fontSize: 11,
  },
  stockBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  stockVerde: {
    backgroundColor: '#1a472a',
  },
  stockNaranja: {
    backgroundColor: '#7a3e00',
  },
  stockTexto: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  vacio: {
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  reservarBtn: {
    backgroundColor: '#4A90D9',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  reservarTexto: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  }
});
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';
import { LubbiLogo } from './LubbiLogo';
import { cerrarSesion, Sesion } from '../utils/session';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = SCREEN_WIDTH * 0.80;

interface MenuItem {
  icono: string;
  label: string;
  ruta?: string;
  accion?: () => void;
}

interface LubbiDrawerProps {
  visible: boolean;
  onClose: () => void;
  sesion: Sesion | null;
}

const menuComprador: MenuItem[] = [
  { icono: '🏠', label: 'Inicio', ruta: '/cliente-home' },
  { icono: '🛒', label: 'Mis compras', ruta: '/mis-compras' },
  { icono: '📋', label: 'Mis reservas', ruta: '/mis-reservas' },
  { icono: '❤️', label: 'Favoritos', ruta: '/favoritos' },
  { icono: '🔔', label: 'Notificaciones', ruta: '/notificaciones' },
  { icono: '💬', label: 'Mis conversaciones', ruta: '/conversaciones' },
  { icono: '👤', label: 'Mi perfil', ruta: '/mi-perfil' },
  { icono: '⚙️', label: 'Configuración', ruta: '/configuracion' },
];

const menuVendedor: MenuItem[] = [
  { icono: '🏠', label: 'Inicio', ruta: '/vendedor-home' },
  { icono: '📦', label: 'Mis productos', ruta: '/vendedor-productos' },
  { icono: '📊', label: 'Inventario', ruta: '/vendedor-inventario' },
  { icono: '🛒', label: 'Ventas', ruta: '/vendedor-ventas' },
  { icono: '📋', label: 'Reservas recibidas', ruta: '/vendedor-reservas' },
  { icono: '💬', label: 'Conversaciones', ruta: '/conversaciones' },
  { icono: '🔔', label: 'Notificaciones', ruta: '/notificaciones' },
  { icono: '👤', label: 'Mi perfil', ruta: '/mi-perfil' },
  { icono: '⚙️', label: 'Configuración', ruta: '/configuracion' },
];

export function LubbiDrawer({ visible, onClose, sesion }: LubbiDrawerProps) {
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -DRAWER_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleNav = (ruta: string) => {
    onClose();
    setTimeout(() => router.push(ruta as any), 260);
  };

  const handleLogout = async () => {
    onClose();
    setTimeout(async () => {
      await cerrarSesion();
      router.replace('/login');
    }, 260);
  };

  const menu = sesion?.rol === 'vendedor' ? menuVendedor : menuComprador;

  const rolLabel = sesion?.rol === 'vendedor' ? 'Vendedor' : 'Comprador';
  const rolColor = sesion?.rol === 'vendedor' ? '#FFD700' : '#4A90D9';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Toque fuera cierra el drawer */}
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Panel del Drawer */}
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          {/* Cabecera */}
          <View style={styles.drawerHeader}>
            <LubbiLogo size={70} />
            <Text style={styles.headerTitle}>LUBBI</Text>
            {sesion && (
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{sesion.nombre} {sesion.apellido}</Text>
                <Text style={styles.userEmail}>{sesion.email}</Text>
                <View style={[styles.rolBadge, { backgroundColor: rolColor + '22', borderColor: rolColor }]}>
                  <Text style={[styles.rolText, { color: rolColor }]}>{rolLabel}</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Items del menú */}
          <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
            {menu.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.menuItem}
                onPress={() => item.ruta ? handleNav(item.ruta) : item.accion?.()}
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icono}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.divider} />

          {/* Cerrar sesión */}
          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout} activeOpacity={0.7}>
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={styles.logoutLabel}>Cerrar sesión</Text>
          </TouchableOpacity>

          <View style={styles.drawerFooter}>
            <Text style={styles.footerText}>LUBBI v1.0 · Santa Cruz, Bolivia</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#0A1628',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#0D1F3C',
    borderTopRightRadius: 24,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 4,
  },
  userInfo: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
  rolBadge: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  rolText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#1C2E4A',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  menuScroll: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  menuIcon: {
    fontSize: 20,
    width: 36,
  },
  menuLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  logoutLabel: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '600',
  },
  drawerFooter: {
    paddingBottom: 28,
    paddingTop: 8,
    alignItems: 'center',
  },
  footerText: {
    color: '#333D4F',
    fontSize: 12,
  },
});

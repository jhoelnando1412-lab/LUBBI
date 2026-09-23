import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { obtenerSesion } from '../utils/session';

interface Conversacion {
  id: string;
  estado: string;
  codigo_reserva: string;
  vendedor: string;
  nombre_vendedor: string;
  ultimo_mensaje: string;
  ultimo_mensaje_fecha: string;
}

interface Mensaje {
  id: string;
  mensaje: string;
  leido: boolean;
  created_at: string;
  remitente: string;
}

export default function Conversaciones() {
  const params = useLocalSearchParams();
  const conversacionId = params.id as string | undefined;

  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [nuevoMsg, setNuevoMsg] = useState('');
  const [cargando, setCargando] = useState(true);
  const [sesionUsuario, setSesionUsuario] = useState<any>(null);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    const cargar = async () => {
      const sesion = await obtenerSesion();
      setSesionUsuario(sesion);
      if (!sesion) return;

      if (conversacionId) {
        // Ver mensajes de una conversación específica
        const res = await fetch(`https://lubbi.onrender.comom/api/perfil/conversaciones/${conversacionId}/mensajes`);
        const data = await res.json();
        setMensajes(data);
      } else {
        // Listar conversaciones del usuario
        const res = await fetch(`https://lubbi.onrender.comom/api/perfil/${sesion.usuario_id}/conversaciones`);
        const data = await res.json();
        setConversaciones(data);
      }
      setCargando(false);
    };
    cargar();
  }, [conversacionId]);

  const enviarMensaje = async () => {
    if (!nuevoMsg.trim() || !conversacionId || !sesionUsuario) return;
    try {
      const res = await fetch(`https://lubbi.onrender.comom/api/perfil/conversaciones/${conversacionId}/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ remitente_usuario_id: sesionUsuario.usuario_id, mensaje: nuevoMsg.trim() }),
      });
      const data = await res.json();
      setMensajes(prev => [...prev, { ...data, remitente: sesionUsuario.nombre }]);
      setNuevoMsg('');
      setTimeout(() => flatRef.current?.scrollToEnd(), 100);
    } catch (e) { console.error(e); }
  };

  if (conversacionId) {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.titulo}>Chat</Text>
        </View>
        {cargando ? (
          <ActivityIndicator color="#4A90D9" size="large" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            ref={flatRef}
            data={mensajes}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
            onContentSizeChange={() => flatRef.current?.scrollToEnd()}
            renderItem={({ item }) => {
              const esMio = item.remitente === sesionUsuario?.nombre;
              return (
                <View style={[styles.bubble, esMio ? styles.bubbleMio : styles.bubbleOtro]}>
                  {!esMio && <Text style={styles.remitente}>{item.remitente}</Text>}
                  <Text style={styles.msgTexto}>{item.mensaje}</Text>
                  <Text style={styles.msgFecha}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              );
            }}
          />
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.msgInput}
            value={nuevoMsg}
            onChangeText={setNuevoMsg}
            placeholder="Escribe un mensaje..."
            placeholderTextColor="#666"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={enviarMensaje}>
            <Text style={styles.sendIcon}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Conversaciones</Text>
      </View>
      {cargando ? (
        <ActivityIndicator color="#4A90D9" size="large" style={{ marginTop: 40 }} />
      ) : conversaciones.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💬</Text>
          <Text style={styles.emptyText}>Sin conversaciones activas</Text>
        </View>
      ) : (
        <FlatList
          data={conversaciones}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.convCard}
              onPress={() => router.push({ pathname: '/conversaciones', params: { id: item.id } } as any)}
            >
              <Text style={styles.convIcon}>💬</Text>
              <View style={styles.convInfo}>
                <Text style={styles.convVendedor}>{item.vendedor}</Text>
                <Text style={styles.convReserva}>Reserva: {item.codigo_reserva}</Text>
                {item.ultimo_mensaje && <Text style={styles.convUltimo} numberOfLines={1}>{item.ultimo_mensaje}</Text>}
              </View>
            </TouchableOpacity>
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
  emptyText: { color: '#999', fontSize: 16 },
  convCard: { backgroundColor: '#1C2E4A', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#2A4A6B' },
  convIcon: { fontSize: 28, marginRight: 14 },
  convInfo: { flex: 1 },
  convVendedor: { color: '#fff', fontWeight: 'bold', fontSize: 15, marginBottom: 2 },
  convReserva: { color: '#4A90D9', fontSize: 12, marginBottom: 4 },
  convUltimo: { color: '#999', fontSize: 13 },
  // Chat view
  bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 10 },
  bubbleMio: { backgroundColor: '#1A3A6B', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  bubbleOtro: { backgroundColor: '#1C2E4A', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  remitente: { color: '#4A90D9', fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  msgTexto: { color: '#fff', fontSize: 15 },
  msgFecha: { color: '#666', fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#0D1F3C', alignItems: 'flex-end' },
  msgInput: { flex: 1, backgroundColor: '#1C2E4A', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, color: '#fff', fontSize: 15, maxHeight: 100, borderWidth: 1, borderColor: '#2A4A6B' },
  sendBtn: { width: 44, height: 44, backgroundColor: '#4A90D9', borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  sendIcon: { color: '#fff', fontSize: 18 },
});

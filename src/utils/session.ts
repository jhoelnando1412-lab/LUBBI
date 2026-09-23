import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Sesion {
  activa: boolean;
  usuario_id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'comprador' | 'vendedor' | 'administrador';
}

export const guardarSesion = async (sesion: Sesion): Promise<void> => {
  try {
    await AsyncStorage.setItem('sesion', JSON.stringify(sesion));
  } catch (error) {
    console.error('Error al guardar la sesión', error);
  }
};

export const obtenerSesion = async (): Promise<Sesion | null> => {
  try {
    const sesionStr = await AsyncStorage.getItem('sesion');
    if (sesionStr) {
      return sesionStr as unknown as Sesion;
    }
    return null;
  } catch (error) {
    console.error('Error al obtener la sesión', error);
    return null;
  }
};

export const cerrarSesion = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('sesion');
  } catch (error) {
    console.error('Error al cerrar la sesión', error);
  }
};

export const haySesion = async (): Promise<boolean> => {
  try {
    const sesion = await obtenerSesion();
    return !!sesion && sesion.activa;
  } catch (error) {
    return false;
  }
};

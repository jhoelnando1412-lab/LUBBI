import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth & core */}
        <Stack.Screen name="splash" />
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="registro" />

        {/* Main home screens */}
        <Stack.Screen name="home" />
        <Stack.Screen name="cliente-home" />
        <Stack.Screen name="vendedor-home" />

        {/* Shopping flow */}
        <Stack.Screen name="tienda" />
        <Stack.Screen name="reserva" />
        <Stack.Screen name="reserva-confirmacion" />

        {/* Drawer menu — comprador */}
        <Stack.Screen name="mis-compras" />
        <Stack.Screen name="mis-reservas" />
        <Stack.Screen name="favoritos" />
        <Stack.Screen name="notificaciones" />
        <Stack.Screen name="conversaciones" />
        <Stack.Screen name="mi-perfil" />
        <Stack.Screen name="configuracion" />

        {/* Drawer menu — vendedor */}
        <Stack.Screen name="vendedor-productos" />
        <Stack.Screen name="vendedor-inventario" />
        <Stack.Screen name="vendedor-ventas" />
        <Stack.Screen name="vendedor-reservas" />
      </Stack>
    </ThemeProvider>
  );
}
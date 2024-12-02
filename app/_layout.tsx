import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider } from '@/context/ThemeProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono/SpaceMono-Regular.ttf'),
    Poppins_400Regular: require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    Poppins_500Medium: require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    Poppins_600SemiBold: require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    Poppins_600Bold: require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    Roboto_Light: require('../assets/fonts/Roboto/Roboto-Light.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

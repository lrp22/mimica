import "@/global.css";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { AppThemeProvider } from "@/contexts/app-theme-context";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="setup" />
                <Stack.Screen name="interstitial" />
                <Stack.Screen name="game" />
                <Stack.Screen name="scoring" />
            </Stack>
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
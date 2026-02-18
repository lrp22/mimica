import "@/global.css";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Uniwind } from "uniwind";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { useEffect } from "react";

// Screens where accidental back navigation would ruin the game
const GAME_FLOW_SCREENS = [
  "interstitial",
  "game",
  "scoring",
  "scoreboard",
] as const;

export default function Layout() {
  useEffect(() => {
    Uniwind.setTheme("dark");
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <AppThemeProvider>
          <HeroUINativeProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="setup" />
              {GAME_FLOW_SCREENS.map((name) => (
                <Stack.Screen
                  key={name}
                  name={name}
                  options={{
                    gestureEnabled: false,
                    animation: "fade",
                  }}
                />
              ))}
            </Stack>
          </HeroUINativeProvider>
        </AppThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TEAM_THEME = {
  A: {
    border: "border-red-600",
    iconColor: "#dc2626",
  },
  B: {
    border: "border-blue-600",
    iconColor: "#2563eb",
  },
} as const;


export default function Interstitial() {
  const { currentTeam, teamA, teamB, generateBatch } = useGameStore();
  const insets = useSafeAreaInsets();
  const activeTeam = currentTeam === 'A' ? teamA : teamB;
  const theme = TEAM_THEME[currentTeam];

  return (
    <View 
      className="flex-1 bg-background justify-center items-center p-6"
      style={{ 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom 
      }}
    >
      <Surface className={`p-8 rounded-3xl items-center gap-6 w-full max-w-sm bg-surface border-2 ${theme.border}`}>
        <Ionicons name="hand-right" size={80} color={theme.iconColor} />
        <View className="items-center">
          <Text className="text-4xl font-black text-center text-foreground">
            Vez do {activeTeam}
          </Text>
        </View>

        <Text className="text-center text-surface-secondary-foreground text-lg">
          Passe o celular para o mímico. O restante do time não pode ver!
        </Text>

        <Button 
          size="lg" 
          className="w-full h-16" 
          onPress={() => {
            generateBatch();
            router.replace("/game");
          }}
        >
          <Text className="text-foreground font-bold text-xl">VER PALAVRAS</Text>
        </Button>
      </Surface>
    </View>
  );
}
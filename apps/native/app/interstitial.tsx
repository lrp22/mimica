import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";

export default function Interstitial() {
  const { currentTeam, teamA, teamB, generateBatch } = useGameStore();
  const activeTeam = currentTeam === 'A' ? teamA : teamB;

  return (
    <Container className="justify-center p-6">
      <Surface variant="secondary" className="p-8 rounded-3xl items-center gap-6">
        <Ionicons name="hand-right" size={80} color="#6366f1" />
        <View className="items-center">
          <Text className="text-muted uppercase font-bold">Prepare-se</Text>
          <Text className="text-4xl font-black text-center text-foreground">Vez do {activeTeam}</Text>
        </View>
        <Text className="text-center text-muted text-lg">
          Passe o celular para o mímico. O restante do time não pode ver!
        </Text>
        <Button size="lg" className="w-full h-16" onPress={() => {
          generateBatch();
          router.replace("/game");
        }}>
          <Text className="text-primary-foreground font-bold text-xl">VER PALAVRAS</Text>
        </Button>
      </Surface>
    </Container>
  );
}
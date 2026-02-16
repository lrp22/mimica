import { useState } from "react";
import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View, Pressable } from "react-native";
import { Container } from "@/components/container";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";

export default function Scoring() {
  const { currentBatch, addScore, switchTeam, maxScore, scores, currentTeam } = useGameStore();
  const [selected, setSelected] = useState<string[]>([]);

  const handleFinish = () => {
    addScore(selected.length);
    const total = (currentTeam === 'A' ? scores.A : scores.B) + selected.length;

    if (total >= maxScore) {
      alert("🏆 JOGO TERMINADO!");
      router.replace("/");
    } else {
      switchTeam();
      router.replace("/interstitial");
    }
  };

  return (
    <Container className="p-6">
      <Text className="text-2xl font-bold mb-4 text-foreground">Quem acertou?</Text>
      <View className="flex-1 gap-3">
        {currentBatch.map(item => (
          <Pressable key={item.id} onPress={() => {
            setSelected(s => s.includes(item.id) ? s.filter(id => id !== item.id) : [...s, item.id]);
          }}>
            <Surface className={`p-5 rounded-2xl flex-row justify-between border-2 ${selected.includes(item.id) ? 'border-primary bg-primary/10' : 'border-transparent'}`}>
              <Text className="text-lg font-bold text-foreground">{item.word}</Text>
              <Ionicons name={selected.includes(item.id) ? "checkbox" : "square-outline"} size={24} color="#6366f1" />
            </Surface>
          </Pressable>
        ))}
      </View>
      <Button size="lg" className="mt-6" onPress={handleFinish}>
        <Text className="text-primary-foreground font-bold">CONFIRMAR PONTOS</Text>
      </Button>
    </Container>
  );
}
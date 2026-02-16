import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View, Vibration } from "react-native";
import { Container } from "@/components/container";
import { useGameStore } from "@/store/game-store";

export default function Game() {
  const { currentBatch, roundTime } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(roundTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      Vibration.vibrate(500);
      router.replace("/scoring");
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <Container isScrollable={false} className="p-4">
      <View className="items-center py-6">
        <Surface className={`px-8 py-2 rounded-full border-2 ${timeLeft < 10 ? 'border-red-500' : 'border-primary'}`}>
          <Text className={`text-4xl font-black ${timeLeft < 10 ? 'text-red-500' : 'text-foreground'}`}>
            {timeLeft}s
          </Text>
        </Surface>
      </View>

      <View className="flex-1 gap-3">
        {currentBatch.map((item) => (
          <Surface key={item.id} className="p-4 rounded-xl border-l-8 border-primary flex-row justify-between items-center">
            <View>
              <Text className="text-xs text-muted font-bold uppercase">{item.category}</Text>
              <Text className="text-xl font-bold text-foreground">{item.word}</Text>
            </View>
            <Text className="text-primary">{"★".repeat(item.difficulty)}</Text>
          </Surface>
        ))}
      </View>

      <Button className="mt-4 h-16" onPress={() => router.replace("/scoring")}>
        <Text className="text-primary-foreground font-bold">CONCLUÍDO</Text>
      </Button>
    </Container>
  );
}
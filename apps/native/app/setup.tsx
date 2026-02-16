import { router } from "expo-router";
import { Button, Surface, useThemeColor } from "heroui-native";
import { Text, TextInput, View, Pressable } from "react-native";
import { Container } from "@/components/container";
import { useGameStore } from "@/store/game-store";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SetupScreen() {
  const store = useGameStore();
  const [teamA, setTeamA] = useState(store.teamA);
  const [teamB, setTeamB] = useState(store.teamB);
  const [maxScore, setMaxScore] = useState(store.maxScore);
  const [time, setTime] = useState(store.roundTime);
  const primaryColor = useThemeColor("primary");

  const handleStart = () => {
    store.setSettings({ teamA, teamB, maxScore, roundTime: time });
    store.resetGame();
    router.push("/interstitial"); 
  };

  return (
    <Container className="p-6">
      <View className="mb-6 mt-4">
        <Text className="text-3xl font-bold text-foreground">Configuração</Text>
      </View>
      <View className="gap-6">
        <Surface variant="secondary" className="p-5 rounded-xl gap-4">
            <View className="flex-row items-center gap-2">
                <Ionicons name="people" size={20} color={primaryColor} />
                <Text className="font-semibold text-lg text-foreground">Equipes</Text>
            </View>
            <TextInput 
                className="bg-background p-3 rounded-lg text-foreground border border-border"
                value={teamA} onChangeText={setTeamA} placeholder="Time 1" placeholderTextColor="#999"
            />
            <TextInput 
                className="bg-background p-3 rounded-lg text-foreground border border-border"
                value={teamB} onChangeText={setTeamB} placeholder="Time 2" placeholderTextColor="#999"
            />
        </Surface>
        <Surface variant="secondary" className="p-5 rounded-xl gap-6">
            <View>
                <Text className="text-foreground font-medium mb-2">Pontuação Máxima: <Text className="text-primary font-bold">{maxScore}</Text></Text>
                <View className="flex-row gap-2">
                    {[15, 30, 50].map((val) => (
                        <Pressable key={val} onPress={() => setMaxScore(val)} className={`flex-1 p-3 rounded-lg items-center border ${maxScore === val ? "bg-primary border-primary" : "bg-background border-border"}`}>
                            <Text className={maxScore === val ? "text-white font-bold" : "text-foreground"}>{val}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
            <View>
                <Text className="text-foreground font-medium mb-2">Tempo: <Text className="text-primary font-bold">{time}s</Text></Text>
                <View className="flex-row gap-2">
                    {[60, 90, 120].map((val) => (
                        <Pressable key={val} onPress={() => setTime(val)} className={`flex-1 p-3 rounded-lg items-center border ${time === val ? "bg-primary border-primary" : "bg-background border-border"}`}>
                            <Text className={time === val ? "text-white font-bold" : "text-foreground"}>{val}s</Text>
                        </Pressable>
                    ))}
                </View>
            </View>
        </Surface>
      </View>
      <View className="flex-1 justify-end pb-6">
        <Button size="lg" className="w-full" onPress={handleStart}>
            <Text className="text-primary-foreground font-bold text-lg">Começar</Text>
        </Button>
      </View>
    </Container>
  );
}
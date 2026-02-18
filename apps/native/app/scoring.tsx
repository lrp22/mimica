import { useState } from "react";
import { router } from "expo-router";
import { Button } from "heroui-native";
import { Text, View, Pressable } from "react-native";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Scoring() {
  const { currentBatch, currentTeam, teamA, teamB, submitRound } =
    useGameStore();
  const [correctIds, setCorrectIds] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  const activeTeamName = currentTeam === "A" ? teamA : teamB;

  const handleToggle = (id: string) => {
    setCorrectIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    submitRound(correctIds);
    router.replace("/scoreboard");
  };

  return (
    <View
      className="flex-1 bg-background px-5"
      style={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      {/* ── Header ───────────────────────────────────── */}
      <View className="items-center mb-6">
        <Ionicons name="alarm" size={40} color="#ef4444" />
        <Text className="text-foreground text-3xl font-black mt-3">Tempo!</Text>
        <Text className="text-muted text-base mt-1">
          Marque as palavras que{" "}
          <Text className="text-accent font-bold">{activeTeamName}</Text>{" "}
          acertou
        </Text>
      </View>

      {/* ── Word Cards ───────────────────────────────── */}
      <View className="flex-1 gap-3 justify-center">
        {currentBatch.map((item) => {
          const isCorrect = correctIds.includes(item.id);
          return (
            <Pressable key={item.id} onPress={() => handleToggle(item.id)}>
              <View
                className={`p-4 rounded-2xl flex-row items-center border-2 ${
                  isCorrect
                    ? "border-accent bg-accent/10"
                    : "border-border bg-surface"
                }`}
              >
                <Ionicons
                  name={isCorrect ? "checkmark-circle" : "close-circle"}
                  size={28}
                  color={isCorrect ? "#4ade80" : "#52525b"}
                />
                <Text
                  className={`text-lg font-bold flex-1 ml-4 ${
                    isCorrect ? "text-foreground" : "text-muted"
                  }`}
                >
                  {item.word}
                </Text>
                {isCorrect && (
                  <Text className="text-accent font-black text-sm">+1</Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ── Submit Button ────────────────────────────── */}
      <Button
        className="h-20 rounded-2xl bg-accent mt-6"
        onPress={handleSubmit}
      >
        <Text className="text-accent-foreground font-black text-2xl uppercase">
          CONFIRMAR · {correctIds.length}/{currentBatch.length}
        </Text>
      </Button>
    </View>
  );
}

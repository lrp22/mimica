import { useState } from "react";
import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View, Pressable, ScrollView } from "react-native";
import { Container } from "@/components/container";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";

export default function Scoring() {
  const {
    currentBatch,
    addScore,
    switchTeam,
    maxScore,
    scores,
    currentTeam,
    teamA,
    teamB,
  } = useGameStore();
  const [selected, setSelected] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Controls view state

  const activeTeamName = currentTeam === "A" ? teamA : teamB;

  const handleToggle = (id: string) => {
    if (isSubmitted) return; // Lock after submit
    setSelected((s) =>
      s.includes(id) ? s.filter((i) => i !== id) : [...s, id],
    );
  };

  const handleSubmit = () => {
    addScore(selected.length);
    setIsSubmitted(true);
  };

  const handleNextRound = () => {
    const newTotal =
      (currentTeam === "A" ? scores.A : scores.B) + selected.length;

    // Check Winner
    if (newTotal >= maxScore) {
      alert(`🏆 ${activeTeamName} WINS!`);
      router.replace("/"); // Back to Home
    } else {
      switchTeam();
      router.replace("/interstitial");
    }
  };

  // --- VIEW 1: CHECKBOXES (Validation) ---
  if (!isSubmitted) {
    return (
      <Container className="bg-zinc-950 p-6">
        <Text className="text-center text-zinc-400 font-bold uppercase tracking-widest mb-2">
          Time's Up!
        </Text>
        <Text className="text-center text-white text-3xl font-black mb-8">
          What did you get?
        </Text>

        <ScrollView className="flex-1 gap-3">
          {currentBatch.map((item) => {
            const isChecked = selected.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => handleToggle(item.id)}
                className="mb-3"
              >
                <Surface
                  className={`p-5 rounded-2xl flex-row justify-between border-2 ${isChecked ? "border-fuchsia-500 bg-fuchsia-900/20" : "border-zinc-800 bg-zinc-900"}`}
                >
                  <Text
                    className={`text-lg font-bold ${isChecked ? "text-white" : "text-zinc-500"}`}
                  >
                    {item.word}
                  </Text>
                  <Ionicons
                    name={isChecked ? "checkbox" : "square-outline"}
                    size={28}
                    color={isChecked ? "#d946ef" : "#52525b"}
                  />
                </Surface>
              </Pressable>
            );
          })}
        </ScrollView>

        <Button
          size="lg"
          className="h-16 rounded-2xl bg-fuchsia-600 mt-4"
          onPress={handleSubmit}
        >
          <Text className="text-white font-bold text-xl">
            SUBMIT SCORE ({selected.length})
          </Text>
        </Button>
      </Container>
    );
  }

  // --- VIEW 2: SCOREBOARD (E) ---
  return (
    <Container className="bg-zinc-950 justify-center p-6">
      <View className="items-center mb-10">
        <Text className="text-4xl mb-2">📊</Text>
        <Text className="text-white text-3xl font-black uppercase tracking-widest">
          Scoreboard
        </Text>
      </View>

      {/* Team A Card */}
      <Surface
        className={`p-6 rounded-3xl mb-4 flex-row justify-between items-center ${currentTeam === "A" ? "border-2 border-fuchsia-500 bg-zinc-900" : "bg-zinc-900 opacity-60"}`}
      >
        <View>
          <Text className="text-zinc-400 text-xs font-bold uppercase">
            Team 1
          </Text>
          <Text className="text-white text-2xl font-bold">{teamA}</Text>
        </View>
        <Text className="text-4xl font-black text-fuchsia-500">
          {scores.A + (currentTeam === "A" ? selected.length : 0)}
        </Text>
      </Surface>

      {/* VS */}
      <Text className="text-center text-zinc-600 font-black italic text-xl mb-4">
        VS
      </Text>

      {/* Team B Card */}
      <Surface
        className={`p-6 rounded-3xl mb-8 flex-row justify-between items-center ${currentTeam === "B" ? "border-2 border-fuchsia-500 bg-zinc-900" : "bg-zinc-900 opacity-60"}`}
      >
        <View>
          <Text className="text-zinc-400 text-xs font-bold uppercase">
            Team 2
          </Text>
          <Text className="text-white text-2xl font-bold">{teamB}</Text>
        </View>
        <Text className="text-4xl font-black text-blue-500">
          {scores.B + (currentTeam === "B" ? selected.length : 0)}
        </Text>
      </Surface>

      <View className="h-[1px] bg-zinc-800 w-full mb-8" />

      <Button
        size="lg"
        className="h-16 rounded-2xl bg-white"
        onPress={handleNextRound}
      >
        <Text className="text-black font-black text-xl">START NEXT ROUND</Text>
        <Ionicons
          name="arrow-forward"
          size={24}
          color="black"
          style={{ marginLeft: 8 }}
        />
      </Button>
    </Container>
  );
}

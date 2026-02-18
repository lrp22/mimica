import { router } from "expo-router";
import { Button } from "heroui-native";
import { Text, View } from "react-native";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Scoreboard() {
  const {
    scores,
    teamA,
    teamB,
    currentTeam,
    maxScore,
    currentBatch,
    lastRoundCorrectIds,
    roundNumber,
    advanceToNextTurn,
  } = useGameStore();
  const insets = useSafeAreaInsets();

  const hasWinner = scores.A >= maxScore || scores.B >= maxScore;
  const leader: "A" | "B" | null =
    scores.A > scores.B ? "A" : scores.B > scores.A ? "B" : null;
  const leaderName = leader === "A" ? teamA : leader === "B" ? teamB : null;
  const activeTeamName = currentTeam === "A" ? teamA : teamB;

  // Progress dots based on score proximity to maxScore
  const progress = Math.max(scores.A, scores.B) / maxScore;
  const totalDots = 10;
  const filledDots = Math.min(Math.round(progress * totalDots), totalDots);

  const handleNext = () => {
    if (hasWinner) {
      router.replace("/");
    } else {
      advanceToNextTurn();
      router.replace("/interstitial");
    }
  };

  return (
    <View
      className="flex-1 bg-background px-5"
      style={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 16,
      }}
    >
      {/* ── Progress Dots ────────────────────────────── */}
      <View className="flex-row justify-center gap-2 mb-6">
        {[...Array(totalDots)].map((_, i) => (
          <View
            key={i}
            className={`w-2.5 h-2.5 rounded-full ${
              i < filledDots ? "bg-accent" : "bg-border"
            }`}
          />
        ))}
      </View>

      {/* ── Leader / Winner Banner ───────────────────── */}
      <View className="items-center mb-6">
        {hasWinner ? (
          <>
            <Text className="text-6xl mb-2">🏆</Text>
            <Text className="text-foreground text-3xl font-black text-center">
              <Text className="text-accent">{leaderName}</Text> venceu!
            </Text>
          </>
        ) : leader ? (
          <Text className="text-foreground text-2xl font-black text-center">
            <Text className="text-accent">{leaderName}</Text> na liderança!
          </Text>
        ) : (
          <Text className="text-foreground text-2xl font-black text-center">
            Empate! 🤝
          </Text>
        )}
      </View>

      {/* ── Score Cards ──────────────────────────────── */}
      <View className="flex-row gap-4 mb-8">
        {/* Team A */}
        <View
          className={`flex-1 p-5 rounded-3xl border-2 items-center ${
            leader === "A"
              ? "border-accent bg-accent/10"
              : "border-border bg-surface"
          }`}
        >
          <Ionicons
            name={leader === "A" ? "flame" : "snow"}
            size={24}
            color={leader === "A" ? "#4ade80" : "#6b7280"}
          />
          <Text className="text-muted text-xs font-bold uppercase mt-2 tracking-widest">
            {teamA}
          </Text>
          <Text
            className={`text-5xl font-black mt-1 ${
              leader === "A" ? "text-accent" : "text-foreground"
            }`}
          >
            {scores.A}
          </Text>
        </View>

        {/* Team B */}
        <View
          className={`flex-1 p-5 rounded-3xl border-2 items-center ${
            leader === "B"
              ? "border-accent bg-accent/10"
              : "border-border bg-surface"
          }`}
        >
          <Ionicons
            name={leader === "B" ? "flame" : "snow"}
            size={24}
            color={leader === "B" ? "#4ade80" : "#6b7280"}
          />
          <Text className="text-muted text-xs font-bold uppercase mt-2 tracking-widest">
            {teamB}
          </Text>
          <Text
            className={`text-5xl font-black mt-1 ${
              leader === "B" ? "text-accent" : "text-foreground"
            }`}
          >
            {scores.B}
          </Text>
        </View>
      </View>

      {/* ── Round Highlights ─────────────────────────── */}
      <View className="flex-1">
        <Text className="text-muted text-xs font-bold uppercase tracking-widest mb-3">
          Destaques — {activeTeamName}
        </Text>
        <View className="gap-2">
          {currentBatch.map((item) => {
            const correct = lastRoundCorrectIds.includes(item.id);
            return (
              <View
                key={item.id}
                className={`flex-row items-center gap-3 py-3 px-4 rounded-xl ${
                  correct ? "bg-accent/10" : "bg-surface"
                }`}
              >
                <Ionicons
                  name={correct ? "checkmark-circle" : "close-circle"}
                  size={22}
                  color={correct ? "#4ade80" : "#ef4444"}
                />
                <Text
                  className={`text-base font-semibold flex-1 ${
                    correct ? "text-foreground" : "text-muted line-through"
                  }`}
                >
                  {item.word}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── Next Round Button ────────────────────────── */}
      <Button className="h-16 rounded-full bg-accent mt-4" onPress={handleNext}>
        <Text className="text-accent-foreground font-black text-lg uppercase tracking-wide">
          {hasWinner ? "Novo Jogo" : `Começar Rodada ${roundNumber + 1}`}
        </Text>
        <Ionicons
          name={hasWinner ? "home" : "arrow-forward"}
          size={22}
          color="black"
          style={{ marginLeft: 8 }}
        />
      </Button>
    </View>
  );
}

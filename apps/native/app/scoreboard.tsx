import { useEffect } from "react";
import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View, Alert, BackHandler, Pressable } from "react-native";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TEAM_CONFIG = {
  A: {
    barColor: "bg-red-500",
    dotColor: "bg-red-500",
    scoreColor: "text-red-500",
  },
  B: {
    barColor: "bg-blue-500",
    dotColor: "bg-blue-500",
    scoreColor: "text-blue-500",
  },
} as const;

function ProgressBar({
  teamKey,
  teamName,
  score,
  maxScore,
  pointsThisRound,
  isActiveTurn,
}: {
  teamKey: "A" | "B";
  teamName: string;
  score: number;
  maxScore: number;
  pointsThisRound: number;
  isActiveTurn: boolean;
}) {
  const config = TEAM_CONFIG[teamKey];
  const pct = Math.min((score / maxScore) * 100, 100);

  return (
    <View>
      <View className="flex-row justify-between items-center mb-1.5">
        <View className="flex-row items-center gap-2">
          <View className={`w-3 h-3 rounded-full ${config.dotColor}`} />
          <Text className="text-foreground font-bold text-base">
            {teamName}
          </Text>
          {isActiveTurn && pointsThisRound > 0 && (
            <View className="bg-accent/15 px-2 py-0.5 rounded-full">
              <Text className="text-accent text-[10px] font-black">
                +{pointsThisRound}
              </Text>
            </View>
          )}
        </View>
        <Text className="text-foreground font-black text-lg">
          {score}
          <Text className="text-muted font-medium text-xs">/{maxScore}</Text>
        </Text>
      </View>

      <View className="h-3 w-full bg-surface rounded-full overflow-hidden border border-white/5">
        <View
          className={`absolute left-0 top-0 bottom-0 ${config.barColor} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </View>
    </View>
  );
}

function confirmQuit() {
  Alert.alert("Sair do jogo?", "O progresso da partida atual será perdido.", [
    { text: "Continuar jogando", style: "cancel" },
    {
      text: "Sair",
      style: "destructive",
      onPress: () => router.replace("/"),
    },
  ]);
}

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

  useEffect(() => {
    const handler = BackHandler.addEventListener("hardwareBackPress", () => {
      confirmQuit();
      return true;
    });
    return () => handler.remove();
  }, []);

  const hasWinner = scores.A >= maxScore || scores.B >= maxScore;
  const leader: "A" | "B" | null =
    scores.A > scores.B ? "A" : scores.B > scores.A ? "B" : null;
  const leaderName = leader === "A" ? teamA : leader === "B" ? teamB : null;
  const pointsThisRound = lastRoundCorrectIds.length;
  const nextTeamName = currentTeam === "A" ? teamB : teamA;

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
      className="flex-1 bg-background"
      style={{
        paddingTop: insets.top + 10,
        paddingBottom: insets.bottom + 16,
      }}
    >
      {/* ── Header ───────────────────────────────────── */}
      <View className="flex-row justify-between items-center px-6 mb-6">
        <Pressable
          onPress={confirmQuit}
          className="w-10 h-10 rounded-full bg-surface items-center justify-center"
          hitSlop={8}
        >
          <Ionicons name="close" size={18} color="#71717a" />
        </Pressable>
        <Text className="text-muted text-[11px] font-black uppercase tracking-[3px]">
          Placar
        </Text>
        <View className="w-10" />
      </View>

      <View className="px-6 flex-1">
        {/* ── Status + Leader Text ────────────────────── */}
        <View className="items-center mb-8">
          <View className="bg-accent/15 px-4 py-1.5 rounded-full flex-row items-center gap-2 mb-4">
            <Ionicons
              name={hasWinner ? "trophy" : "flag"}
              size={14}
              color="#4ade80"
            />
            <Text className="text-accent font-black text-[11px] uppercase tracking-wider">
              {hasWinner ? "Fim de Jogo" : `Rodada ${roundNumber}`}
            </Text>
          </View>

          {hasWinner ? (
            <View className="items-center">
              <Text className="text-5xl mb-2">🏆</Text>
              <Text className="text-foreground text-2xl font-black text-center">
                {leaderName}
              </Text>
              <Text className="text-accent text-xl font-black">
                venceu a partida!
              </Text>
            </View>
          ) : leader ? (
            <Text className="text-foreground text-2xl font-black text-center">
              {leaderName} <Text className="text-accent">na liderança!</Text>
            </Text>
          ) : (
            <Text className="text-foreground text-2xl font-black text-center">
              Jogo <Text className="text-accent">empatado!</Text>
            </Text>
          )}
        </View>

        {/* ── Progress Bars ──────────────────────────── */}
        <View className="gap-5 mb-6">
          <ProgressBar
            teamKey="A"
            teamName={teamA}
            score={scores.A}
            maxScore={maxScore}
            pointsThisRound={pointsThisRound}
            isActiveTurn={currentTeam === "A"}
          />
          <ProgressBar
            teamKey="B"
            teamName={teamB}
            score={scores.B}
            maxScore={maxScore}
            pointsThisRound={pointsThisRound}
            isActiveTurn={currentTeam === "B"}
          />
        </View>

        {/* ── Round Highlights ───────────────────────── */}
        <Surface className="flex-1 rounded-2xl px-4 py-3 bg-surface border border-white/5">
          <Text className="text-muted text-[10px] font-black uppercase tracking-widest mb-2">
            Destaques
          </Text>

          <View className="gap-0.5">
            {currentBatch.map((item) => {
              const correct = lastRoundCorrectIds.includes(item.id);
              return (
                <View
                  key={item.id}
                  className="flex-row items-center justify-between py-1.5"
                >
                  <View className="flex-row items-center gap-2 flex-1">
                    <Ionicons
                      name={correct ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={correct ? "#4ade80" : "#ef4444"}
                    />
                    <Text
                      className={`text-sm font-medium ${
                        correct ? "text-foreground" : "text-muted line-through"
                      }`}
                      numberOfLines={1}
                    >
                      {item.word}
                    </Text>
                  </View>
                  <Text
                    className={`text-xs font-bold ml-2 ${
                      correct ? "text-accent" : "text-muted"
                    }`}
                  >
                    {correct ? "+1" : "—"}
                  </Text>
                </View>
              );
            })}
          </View>
        </Surface>
      </View>

      {/* ── Footer ──────────────────────────────────── */}
      <View className="px-6 mt-4">
        {!hasWinner && (
          <Text className="text-center text-muted text-[11px] font-bold mb-3 tracking-wide">
            Próximo:{" "}
            <Text className="text-foreground">vez do {nextTeamName}</Text>
          </Text>
        )}

        <Button
          className="h-16 rounded-full bg-accent active:opacity-90"
          onPress={handleNext}
        >
          <Text className="text-accent-foreground font-black text-lg uppercase tracking-tight">
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
    </View>
  );
}

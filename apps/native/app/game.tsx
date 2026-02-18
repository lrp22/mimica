import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View, Vibration } from "react-native";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";
import { useAudioPlayer } from "expo-audio";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const timesUpSound = require("@/assets/sounds/times-up.mp3");

const CATEGORY_STYLES: Record<
  string,
  { color: string; icon: string; label: string }
> = {
  A: { color: "#f87171", icon: "walk", label: "Ação" },
  O: { color: "#60a5fa", icon: "cube", label: "Objeto" },
  P: { color: "#fbbf24", icon: "paw", label: "Pessoa" },
  L: { color: "#c084fc", icon: "film", label: "Mídia" },
  D: { color: "#ef4444", icon: "skull", label: "Difícil" },
};

const DEFAULT_STYLE = { color: "#9ca3af", icon: "ellipse", label: "Palavra" };

export default function Game() {
  const { currentBatch, roundTime } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [isFinished, setIsFinished] = useState(false);
  const insets = useSafeAreaInsets();

  const player = useAudioPlayer(timesUpSound);

  // ── Countdown timer ───────────────────────────────
  useEffect(() => {
    if (isFinished) return;

    if (timeLeft <= 10 && timeLeft > 0) {
      Vibration.vibrate(50);
    }

    if (timeLeft <= 0) {
      setIsFinished(true);
      player.seekTo(0);
      player.play();
      router.replace("/scoring");
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleFinish = () => {
    if (isFinished) return;
    setIsFinished(true);
    router.replace("/scoring");
  };

  const isUrgent = timeLeft <= 10;

  return (
    <View
      className="flex-1 bg-background p-4"
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 8,
      }}
    >
      {/* ── Timer ────────────────────────────────────── */}
      <View className="items-center py-4">
        <View
          className={`px-10 py-4 rounded-full border-4 ${
            isUrgent
              ? "border-danger bg-danger/10"
              : "border-accent bg-accent/10"
          }`}
        >
          <Text
            className={`text-5xl font-black ${
              isUrgent ? "text-danger" : "text-accent"
            }`}
          >
            {timeLeft}s
          </Text>
        </View>
      </View>

      {/* ── Word Cards ───────────────────────────────── */}
      <View className="flex-1 gap-3 justify-center">
        {currentBatch.map((item) => {
          const style = CATEGORY_STYLES[item.category] ?? DEFAULT_STYLE;
          return (
            <Surface
              key={item.id}
              className="p-4 rounded-2xl border-l-[6px] bg-surface flex-row justify-between items-center"
              style={{ borderLeftColor: style.color }}
            >
              <View className="flex-1">
                <View className="flex-row items-center gap-2 mb-1">
                  <Ionicons
                    name={style.icon as any}
                    size={12}
                    color={style.color}
                  />
                  <Text
                    style={{ color: style.color }}
                    className="text-xs font-bold uppercase tracking-widest"
                  >
                    {style.label}
                  </Text>
                </View>
                <Text className="text-xl font-bold text-foreground tracking-wide">
                  {item.word}
                </Text>
              </View>

              <View className="flex-row gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={12}
                    color={i < item.difficulty ? style.color : "#3f3f46"}
                  />
                ))}
              </View>
            </Surface>
          );
        })}
      </View>

      {/* ── Done Button ──────────────────────────────── */}
      <Button
        className="mt-6 h-20 rounded-2xl bg-accent"
        onPress={handleFinish}
      >
        <Text className="text-accent-foreground font-black text-2xl uppercase">
          PRONTO!
        </Text>
        <Ionicons
          name="checkmark-circle"
          size={30}
          color="black"
          style={{ marginLeft: 10 }}
        />
      </Button>
    </View>
  );
}

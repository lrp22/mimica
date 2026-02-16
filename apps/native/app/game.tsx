import { useState, useEffect } from "react";
import { router } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View, Vibration } from "react-native";
import { Container } from "@/components/container";
import { useGameStore } from "@/store/game-store";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from 'expo-av'; // Import Audio

export default function Game() {
  const { currentBatch, roundTime } = useGameStore();
  const [timeLeft, setTimeLeft] = useState(roundTime);

  // Audio Logic
  useEffect(() => {
    // 10-second warning tick (simulated with vibration for now)
    if (timeLeft <= 10 && timeLeft > 0) {
       Vibration.vibrate(50); // Short tick
    }
    
    // Time's Up Logic
    if (timeLeft <= 0) {
      Vibration.vibrate([0, 500, 200, 500]); // Long buzz pattern
      handleFinish();
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleFinish = () => {
    router.replace("/scoring");
  };

  // Visuals: Color Coding
  const getCategoryStyle = (cat: string) => {
    switch(cat) {
        case 'A': return { color: '#f87171', icon: 'walk', label: 'Action' }; // Red
        case 'O': return { color: '#60a5fa', icon: 'cube', label: 'Object' }; // Blue
        case 'P': return { color: '#fbbf24', icon: 'paw', label: 'Person/Place' }; // Yellow
        case 'L': return { color: '#c084fc', icon: 'film', label: 'Lore' }; // Purple
        case 'D': return { color: '#ef4444', icon: 'skull', label: 'Hard' }; // Dark Red
        default: return { color: '#9ca3af', icon: 'ellipse', label: 'Word' };
    }
  };

  return (
    <Container isScrollable={false} className="bg-zinc-950 p-4">
      {/* Top Bar: Timer */}
      <View className="items-center py-6">
        <Surface className={`px-8 py-4 rounded-full border-4 ${timeLeft < 10 ? 'border-red-500 bg-red-900/20' : 'border-fuchsia-500 bg-zinc-900'}`}>
          <Text className={`text-5xl font-black ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
            {timeLeft}s
          </Text>
        </Surface>
      </View>

      {/* Main Area: List of 6 Words */}
      <View className="flex-1 gap-3 justify-center">
        {currentBatch.map((item) => {
            const style = getCategoryStyle(item.category);
            return (
                <Surface 
                    key={item.id} 
                    className="p-4 rounded-2xl border-l-[6px] bg-zinc-900 flex-row justify-between items-center"
                    style={{ borderLeftColor: style.color }}
                >
                    <View>
                        <View className="flex-row items-center gap-2 mb-1">
                             <Ionicons name={style.icon as any} size={12} color={style.color} />
                             <Text style={{ color: style.color }} className="text-xs font-bold uppercase tracking-widest">{style.label}</Text>
                        </View>
                        <Text className="text-xl font-bold text-white tracking-wide">{item.word}</Text>
                    </View>
                    
                    {/* Difficulty Stars */}
                    <View className="flex-row gap-0.5">
                        {[...Array(3)].map((_, i) => (
                            <Ionicons 
                                key={i} 
                                name="star" 
                                size={12} 
                                color={i < item.difficulty ? style.color : '#3f3f46'} 
                            />
                        ))}
                    </View>
                </Surface>
            )
        })}
      </View>

      {/* "Done" Button (Mime finished early) */}
      <Button 
        className="mt-6 h-20 rounded-2xl bg-fuchsia-600" 
        onPress={handleFinish}
      >
        <Text className="text-white font-black text-2xl uppercase">DONE! (Finish)</Text>
        <Ionicons name="checkmark-circle" size={30} color="white" style={{marginLeft: 10}} />
      </Button>
    </Container>
  );
}
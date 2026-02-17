import { Link } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
  const insets = useSafeAreaInsets();
  
  return (
    <Container
      // Use 'px-safe' if you want NativeWind to handle safe areas automatically
      className="flex-1 justify-center items-center p-6 bg-background"
      style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <View className="items-center gap-6">
        <View className="items-center">
          <Text className="text-6xl mb-2">🎭</Text>
          <Text className="text-4xl font-bold text-foreground tracking-tight text-center">
            Mímica
          </Text>
          <Text className="text-muted-foreground text-lg text-center mt-2">
            O jogo de charadas offline
          </Text>
        </View>

        <Surface
          variant="secondary"
          className="p-6 rounded-2xl w-full max-w-xs items-center gap-4"
        >
          <Link href="/setup" asChild>
            <Button className="w-full bg-accent py-6 rounded-[30px] shadow-lg active:opacity-90">
              <Button.Label className="text-foreground font-black text-2xl uppercase tracking-tighter">
                Novo Jogo
              </Button.Label>
            </Button>
          </Link>
        </Surface>
      </View>
    </Container>
  );
}
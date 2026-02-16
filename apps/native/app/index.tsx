import { Link } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View } from "react-native";
import { Container } from "@/components/container";

export default function Home() {
  return (
    <Container className="justify-center items-center p-6 bg-background">
      <View className="items-center gap-6">
        <View className="items-center">
            <Text className="text-6xl mb-2">🎭</Text>
            <Text className="text-4xl font-bold text-foreground tracking-tight text-center">
            Mímica
            </Text>
            <Text className="text-muted text-lg text-center mt-2">
            O jogo de charadas offline
            </Text>
        </View>

        <Surface variant="secondary" className="p-6 rounded-2xl w-full max-w-xs items-center gap-4">
            <Link href="/setup" asChild>
                <Button size="lg" className="w-full bg-primary">
                    <Text className="text-primary-foreground font-bold text-lg">Novo Jogo</Text>
                </Button>
            </Link>
        </Surface>
      </View>
    </Container>
  );
}
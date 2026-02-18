import { Link } from "expo-router";
import { Button, Surface } from "heroui-native";
import { Text, View, Image } from "react-native";
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
          <Image
            source={require("@/assets/images/bibinhas_logo.png")}
            className="w-80 h-80 mb-40 mt-20"
            resizeMode="contain"
          />
        </View>
        <Link href="/setup" asChild>
          <Button className="w-full bg-accent active:opacity-90">
            <Button.Label className="text-foreground text-2xl uppercase tracking-tighter">
              Novo Jogo
            </Button.Label>
          </Button>
        </Link>
      </View>
    </Container>
  );
}

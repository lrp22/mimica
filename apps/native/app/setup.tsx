import { router } from "expo-router";
import { Button, Card, cn } from "heroui-native";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import { Container } from "@/components/container";
import { useGameStore } from "@/store/game-store";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const StyledIonicons = withUniwind(Ionicons);

export default function SetupScreen() {
  const store = useGameStore();
  const [showSettings, setShowSettings] = useState(false);
  const [localTeamA, setLocalTeamA] = useState(store.teamA);
  const [localTeamB, setLocalTeamB] = useState(store.teamB);
  const insets = useSafeAreaInsets();

  // Helper to check selection
  const isSelected = (cat: string) => store.categories.includes(cat);
  const isAllSelected = store.categories.length === 5;

  const handleStart = () => {
    store.resetGame();
    router.push("/interstitial");
  };

  const CategoryCard = ({ id, label, sub, icon }: any) => {
    const selected = isSelected(id);
    return (
      <Pressable
        className="w-[48%] mb-4"
        onPress={() => store.toggleCategory(id)}
      >
        <Card
          className={cn(
            "h-30 border-2",
            selected ? "border-accent bg-surface" : "border-border bg-surface",
          )}
        >
          <Card.Header className="flex-row justify-between pb-0">
            <View
              className={cn(
                "w-10 h-10 rounded-full items-center justify-center",
                selected ? "bg-accent" : "bg-muted",
              )}
            >
              <Ionicons
                name={icon}
                size={20}
                color={selected ? "black" : "gray"}
              />
            </View>
            {selected && <View className="w-3 h-3 rounded-full bg-accent" />}
          </Card.Header>

          <Card.Body className="justify-end">
            <Card.Title
              className={selected ? "text-foreground" : "text-foreground"}
            >
              {label}
            </Card.Title>
            <Card.Description className="text-xs text-success">
              {sub}
            </Card.Description>
          </Card.Body>
        </Card>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      {/* SCROLLABLE CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
      >
        <Text className="text-foreground font-bold text-xl mb-4">
          Categorias
        </Text>

        {/* ALL THEMES CARD */}
        <Pressable onPress={store.selectAllCategories} className="mb-6">
          <Card
            className={cn(
              "border-2",
              isAllSelected
                ? "border-accent bg-surface"
                : "border-border bg-surface",
            )}
          >
            <Card.Body className="flex-row items-center p-2 gap-4">
              <View className="w-14 h-14 rounded-full bg-accent/20 items-center justify-center">
                <StyledIonicons
                  name="infinite"
                  size={30}
                  className="text-foreground"
                />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Card.Title className="text-2xl">TODOS</Card.Title>
                  {isAllSelected && (
                    <View className="bg-accent px-2 py-1 rounded-md">
                      <Text className="text-accent-foreground text-[10px] font-bold">
                        SELECIONADO
                      </Text>
                    </View>
                  )}
                </View>
                <Card.Description className="text-success">
                  Mistura total de todas as categorias!
                </Card.Description>
              </View>
            </Card.Body>
          </Card>
        </Pressable>

        {/* GRID */}
        <View className="flex-row flex-wrap justify-between">
          <CategoryCard
            id="A"
            label="Ação"
            sub="Verbos & Movimentos"
            icon="walk"
          />
          <CategoryCard
            id="D"
            label="Difícil"
            sub="Quebra-cabeças"
            icon="extension-puzzle"
          />
          <CategoryCard
            id="O"
            label="Objetos"
            sub="Coisas & Trecos"
            icon="cube"
          />
          <CategoryCard
            id="L"
            label="Mídia"
            sub="Filmes & Livros"
            icon="film"
          />
          <CategoryCard
            id="P"
            label="Pessoas"
            sub="Lugares & Animais"
            icon="paw"
          />
        </View>
      </ScrollView>

      {/* START BUTTON — always pinned to bottom */}
      <View
        className="px-4 pt-2 bg-background"
        style={{ paddingBottom: insets.bottom + 10 }}
      >
        <Button
          size="lg"
          className="w-full h-16 rounded-full shadow-lg bg-accent active:opacity-90"
          onPress={handleStart}
        >
          <Text className="text-accent-foreground font-black text-xl uppercase tracking-widest">
            COMEÇAR JOGO
          </Text>
          <Ionicons
            name="play"
            size={24}
            className="ml-2 text-accent-foreground"
          />
        </Button>
      </View>
    </View>
  );
}

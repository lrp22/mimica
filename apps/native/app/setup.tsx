import { router } from "expo-router";
import { Button, Surface, Card, useThemeColor } from "heroui-native";
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
import { LinearGradient } from "expo-linear-gradient";

export default function SetupScreen() {
  const store = useGameStore();
  const [showSettings, setShowSettings] = useState(false);
  const [localTeamA, setLocalTeamA] = useState(store.teamA);
  const [localTeamB, setLocalTeamB] = useState(store.teamB);

  // Helper to check selection
  const isSelected = (cat: string) => store.categories.includes(cat);
  const isAllSelected = store.categories.length === 5; // A, O, P, L, D

  const handleStart = () => {
    store.resetGame();
    router.push("/interstitial");
  };

  const CategoryCard = ({ id, label, sub, icon, color }: any) => {
    const selected = isSelected(id);
    return (
      <Pressable
        className="w-[48%] mb-4"
        onPress={() => store.toggleCategory(id)}
      >
        <Surface
          variant="secondary"
          className={`h-40 p-4 rounded-3xl justify-between border-2 ${selected ? "border-fuchsia-500 bg-fuchsia-500/10" : "border-zinc-800 bg-zinc-900"}`}
        >
          <View className="flex-row justify-between">
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${selected ? "bg-fuchsia-500" : "bg-zinc-700"}`}
            >
              <Ionicons name={icon} size={20} color="white" />
            </View>
            {selected && (
              <View className="w-3 h-3 rounded-full bg-fuchsia-500" />
            )}
          </View>
          <View>
            <Text className="text-white font-bold text-lg">{label}</Text>
            <Text className="text-zinc-500 text-xs">{sub}</Text>
          </View>
        </Surface>
      </Pressable>
    );
  };

  return (
    <Container className="bg-zinc-950 px-4 pt-4">
      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-6 mt-2">
        <View>
          <Text className="text-fuchsia-400 font-bold text-lg tracking-widest uppercase">
            Charades Party
          </Text>
          <Text className="text-zinc-400 text-sm">Vamos jogar!</Text>
        </View>
        <Pressable
          onPress={() => setShowSettings(true)}
          className="w-10 h-10 bg-zinc-800 rounded-full items-center justify-center"
        >
          <Ionicons name="settings-outline" size={20} color="white" />
        </Pressable>
      </View>

      {/* TEAM TOGGLE (Visual Only for now) */}
      <View className="flex-row bg-zinc-900 p-1 rounded-full mb-8 border border-zinc-800">
        <Pressable className="flex-1 bg-fuchsia-600 rounded-full py-2 items-center">
          <Text className="text-white font-bold">2 Times</Text>
        </Pressable>
        <Pressable className="flex-1 py-2 items-center opacity-50">
          <Text className="text-zinc-400 font-bold">3 Times</Text>
        </Pressable>
        <Pressable className="flex-1 py-2 items-center opacity-50">
          <Text className="text-zinc-400 font-bold">4 Times</Text>
        </Pressable>
      </View>

      <Text className="text-white font-bold text-xl mb-4">
        Escolha as Categorias
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ALL THEMES CARD */}
        <Pressable onPress={store.selectAllCategories} className="mb-6">
          <Surface
            className={`p-6 rounded-3xl flex-row items-center border-2 ${isAllSelected ? "border-fuchsia-500 bg-zinc-900" : "border-zinc-800 bg-zinc-900"}`}
          >
            <View className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-400 to-fuchsia-500 items-center justify-center mr-4 bg-fuchsia-200">
              <Ionicons name="infinite" size={30} color="#c026d3" />
            </View>
            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white font-bold text-2xl">TODOS</Text>
                {isAllSelected && (
                  <View className="bg-fuchsia-500 px-2 py-1 rounded-md">
                    <Text className="text-white text-[10px] font-bold">
                      SELECIONADO
                    </Text>
                  </View>
                )}
              </View>
              <Text className="text-zinc-400">
                Mistura total de todas as categorias!
              </Text>
            </View>
          </Surface>
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

      {/* START BUTTON */}
      <View className="absolute bottom-8 left-4 right-4">
        <Button
          size="lg"
          className="w-full bg-fuchsia-600 h-16 rounded-full shadow-lg shadow-fuchsia-500/50"
          onPress={handleStart}
        >
          <Text className="text-white font-black text-xl uppercase tracking-widest">
            COMEÇAR JOGO
          </Text>
          <Ionicons
            name="play"
            size={24}
            color="white"
            style={{ marginLeft: 8 }}
          />
        </Button>
      </View>

      {/* SETTINGS MODAL */}
      <Modal visible={showSettings} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/60">
          <View className="bg-zinc-900 p-6 rounded-t-3xl border-t border-zinc-700">
            <Text className="text-white text-xl font-bold mb-4">
              Configurações
            </Text>

            <Text className="text-zinc-400 mb-2">Nome do Time 1</Text>
            <TextInput
              value={localTeamA}
              onChangeText={setLocalTeamA}
              className="bg-zinc-800 text-white p-4 rounded-xl mb-4 border border-zinc-700"
            />

            <Text className="text-zinc-400 mb-2">Nome do Time 2</Text>
            <TextInput
              value={localTeamB}
              onChangeText={setLocalTeamB}
              className="bg-zinc-800 text-white p-4 rounded-xl mb-6 border border-zinc-700"
            />

            <Button
              className="w-full bg-fuchsia-600"
              onPress={() => {
                store.setSettings({ teamA: localTeamA, teamB: localTeamB });
                setShowSettings(false);
              }}
            >
              <Text className="text-white font-bold">Salvar e Fechar</Text>
            </Button>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

import { create } from "zustand";
import allWords from "../data/words.json";

export type Word = {
  id: string;
  word: string;
  category: string;
  difficulty: number;
};

interface GameState {
  // Settings
  teamA: string;
  teamB: string;
  maxScore: number;
  roundTime: number;
  categories: string[];

  // Game Status
  scores: { A: number; B: number };
  currentTeam: "A" | "B";
  usedWordIds: string[];
  currentBatch: Word[];
  lastRoundCorrectIds: string[];
  roundNumber: number;

  // Actions
  setSettings: (settings: Partial<GameState>) => void;
  toggleCategory: (cat: string) => void;
  selectAllCategories: () => void;
  setMaxScore: (score: number) => void;
  setRoundTime: (time: number) => void;
  submitRound: (correctIds: string[]) => void;
  advanceToNextTurn: () => void;
  generateBatch: () => void;
  resetGame: () => void;
}

const ALL_CATEGORIES = ["A", "O", "P", "L", "D"];

export const SCORE_OPTIONS = [24, 30, 36, 42] as const;
export const TIMER_OPTIONS = [45, 60, 90, 120] as const;

export const useGameStore = create<GameState>((set, get) => ({
  teamA: "Time A",
  teamB: "Time B",
  maxScore: 24,
  roundTime: 60,
  categories: [...ALL_CATEGORIES],

  scores: { A: 0, B: 0 },
  currentTeam: "A",
  usedWordIds: [],
  currentBatch: [],
  lastRoundCorrectIds: [],
  roundNumber: 1,

  setSettings: (settings) => set((state) => ({ ...state, ...settings })),

  toggleCategory: (cat) =>
    set((state) => {
      const isSelected = state.categories.includes(cat);
      if (isSelected) {
        if (state.categories.length === 1) return state;
        return { categories: state.categories.filter((c) => c !== cat) };
      }
      return { categories: [...state.categories, cat] };
    }),

  selectAllCategories: () => set({ categories: [...ALL_CATEGORIES] }),

  setMaxScore: (score) => set({ maxScore: score }),

  setRoundTime: (time) => set({ roundTime: time }),

  submitRound: (correctIds) =>
    set((state) => {
      const team = state.currentTeam;
      return {
        lastRoundCorrectIds: correctIds,
        scores: {
          ...state.scores,
          [team]: state.scores[team] + correctIds.length,
        },
      };
    }),

  advanceToNextTurn: () =>
    set((state) => ({
      currentTeam: state.currentTeam === "A" ? "B" : "A",
      roundNumber: state.roundNumber + 1,
    })),

  resetGame: () =>
    set({
      scores: { A: 0, B: 0 },
      currentTeam: "A",
      usedWordIds: [],
      currentBatch: [],
      lastRoundCorrectIds: [],
      roundNumber: 1,
    }),

  generateBatch: () => {
    const { usedWordIds, categories } = get();

    let available = allWords.filter(
      (w) => categories.includes(w.category) && !usedWordIds.includes(w.id),
    );

    if (available.length < 6) {
      set({ usedWordIds: [] });
      available = allWords.filter((w) => categories.includes(w.category));
    }

    const newBatch: Word[] = [];
    const batchIds: string[] = [];

    const pickOne = (list: Word[]) => {
      if (list.length === 0) return null;
      return list[Math.floor(Math.random() * list.length)];
    };

    const mandatoryCats = ["A", "O", "P"];
    mandatoryCats.forEach((cat) => {
      if (categories.includes(cat)) {
        const specificPool = available.filter(
          (w) => w.category === cat && !batchIds.includes(w.id),
        );
        const word = pickOne(specificPool);
        if (word) {
          newBatch.push(word);
          batchIds.push(word.id);
        }
      }
    });

    while (newBatch.length < 6) {
      const remainingPool = available.filter((w) => !batchIds.includes(w.id));
      if (remainingPool.length === 0) break;
      const word = pickOne(remainingPool);
      if (word) {
        newBatch.push(word);
        batchIds.push(word.id);
      }
    }

    const shuffledBatch = newBatch.sort(() => Math.random() - 0.5);

    set((state) => ({
      currentBatch: shuffledBatch,
      usedWordIds: [...state.usedWordIds, ...batchIds],
    }));
  },
}));

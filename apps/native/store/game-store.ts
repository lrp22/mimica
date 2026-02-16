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

  // Actions
  setSettings: (settings: Partial<GameState>) => void;
  toggleCategory: (cat: string) => void;
  selectAllCategories: () => void;
  addScore: (points: number) => void;
  switchTeam: () => void;
  generateBatch: () => void;
  resetGame: () => void;
}

const ALL_CATEGORIES = ["A", "O", "P", "L", "D"];

export const useGameStore = create<GameState>((set, get) => ({
  teamA: "Red Team",
  teamB: "Blue Team",
  maxScore: 30,
  roundTime: 60,
  categories: [...ALL_CATEGORIES],

  scores: { A: 0, B: 0 },
  currentTeam: "A",
  usedWordIds: [],
  currentBatch: [],

  setSettings: (settings) => set((state) => ({ ...state, ...settings })),

  toggleCategory: (cat) =>
    set((state) => {
      const isSelected = state.categories.includes(cat);
      if (isSelected) {
        if (state.categories.length === 1) return state; // Must have at least 1
        return { categories: state.categories.filter((c) => c !== cat) };
      }
      return { categories: [...state.categories, cat] };
    }),

  selectAllCategories: () => set({ categories: [...ALL_CATEGORIES] }),

  addScore: (points) =>
    set((state) => {
      const team = state.currentTeam;
      return {
        scores: { ...state.scores, [team]: state.scores[team] + points },
      };
    }),

  switchTeam: () =>
    set((state) => ({
      currentTeam: state.currentTeam === "A" ? "B" : "A",
    })),

  resetGame: () =>
    set({
      scores: { A: 0, B: 0 },
      currentTeam: "A",
      usedWordIds: [],
      currentBatch: [],
    }),

  generateBatch: () => {
    const { usedWordIds, categories } = get();

    // 1. Filter Master List by SELECTED categories + UNUSED words
    let available = allWords.filter(
      (w) => categories.includes(w.category) && !usedWordIds.includes(w.id),
    );

    // Safety: If deck is empty, recycle used words (but keep selected categories)
    if (available.length < 6) {
      set({ usedWordIds: [] });
      available = allWords.filter((w) => categories.includes(w.category));
    }

    const newBatch: Word[] = [];
    const batchIds: string[] = [];

    // Helper to pick a random word from a specific list
    const pickOne = (list: Word[]) => {
      if (list.length === 0) return null;
      const word = list[Math.floor(Math.random() * list.length)];
      return word;
    };

    // --- 2. ENFORCE VARIETY (1 Action, 1 Object, 1 Person) ---
    // Only enforce if the user has actually selected those categories
    const mandatoryCats = ["A", "O", "P"];

    mandatoryCats.forEach((cat) => {
      if (categories.includes(cat)) {
        // Get available words for this mandatory category
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

    // --- 3. FILL THE REST (Randomly) ---
    while (newBatch.length < 6) {
      // Pool of remaining valid words
      const remainingPool = available.filter((w) => !batchIds.includes(w.id));
      if (remainingPool.length === 0) break;

      const word = pickOne(remainingPool);
      if (word) {
        newBatch.push(word);
        batchIds.push(word.id);
      }
    }

    // 4. Shuffle the final batch so "Action" isn't always the first card
    const shuffledBatch = newBatch.sort(() => Math.random() - 0.5);

    set((state) => ({
      currentBatch: shuffledBatch,
      usedWordIds: [...state.usedWordIds, ...batchIds],
    }));
  },
}));

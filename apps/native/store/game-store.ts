import { create } from 'zustand';
import allWords from '../data/words.json';

export type Word = { id: string; word: string; category: string; difficulty: number };

interface GameState {
  // Settings
  teamA: string;
  teamB: string;
  maxScore: number;
  roundTime: number; 
  
  // Game Status
  scores: { A: number; B: number };
  currentTeam: 'A' | 'B';
  usedWordIds: string[];
  currentBatch: Word[];
  
  // Actions
  setSettings: (settings: { teamA: string; teamB: string; maxScore: number; roundTime: number }) => void;
  addScore: (points: number) => void;
  switchTeam: () => void;
  generateBatch: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  teamA: "Time Vermelho",
  teamB: "Time Azul",
  maxScore: 30,
  roundTime: 60,
  
  scores: { A: 0, B: 0 },
  currentTeam: 'A',
  usedWordIds: [],
  currentBatch: [],

  setSettings: (settings) => set((state) => ({ ...state, ...settings })),

  addScore: (points) => set((state) => {
    const team = state.currentTeam;
    return {
      scores: { ...state.scores, [team]: state.scores[team] + points }
    };
  }),

  switchTeam: () => set((state) => ({
    currentTeam: state.currentTeam === 'A' ? 'B' : 'A'
  })),

  resetGame: () => set({
    scores: { A: 0, B: 0 },
    currentTeam: 'A',
    usedWordIds: [],
    currentBatch: []
  }),

  generateBatch: () => {
    const { usedWordIds } = get();
    
    // 1. Get available words
    let available = allWords.filter(w => !usedWordIds.includes(w.id));
    
    // Reset if deck is empty
    if (available.length < 10) {
        available = allWords;
        set({ usedWordIds: [] });
    }

    const pick = (arr: Word[]) => arr[Math.floor(Math.random() * arr.length)];
    const newBatch: Word[] = [];
    const batchIds: string[] = [];

    const addWord = (subset: Word[]) => {
        if (subset.length > 0) {
            const w = pick(subset);
            newBatch.push(w);
            batchIds.push(w.id);
        } else {
             // Fallback
             const random = pick(available.filter(w => !batchIds.includes(w.id)));
             if (random) {
                newBatch.push(random);
                batchIds.push(random.id);
             }
        }
    };

    // Mandatory Categories (A, O, P)
    addWord(available.filter(w => w.category === 'A' && !batchIds.includes(w.id)));
    addWord(available.filter(w => w.category === 'O' && !batchIds.includes(w.id)));
    addWord(available.filter(w => w.category === 'P' && !batchIds.includes(w.id)));

    // Fill the rest (Total 6)
    while (newBatch.length < 6) {
        const remaining = available.filter(w => !batchIds.includes(w.id));
        if (remaining.length === 0) break;
        addWord(remaining);
    }

    set((state) => ({
        currentBatch: newBatch,
        usedWordIds: [...state.usedWordIds, ...batchIds]
    }));
  }
}));
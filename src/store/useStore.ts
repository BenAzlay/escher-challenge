
import { create } from "zustand";

interface StoreState {
  activeRiddle: string,
  setActiveRiddle: (riddle: string) => void,
}

const useStore = create<StoreState>((set) => ({
  activeRiddle: "",
  setActiveRiddle: (riddle) => set((state) => ({ activeRiddle: riddle })),
}));

export default useStore;

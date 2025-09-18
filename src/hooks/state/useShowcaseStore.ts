import { create } from 'zustand';

type State = { search: string; setSearch: (s: string) => void };
export const useShowcaseStore = create<State>((set) => ({
  search: '',
  setSearch: (s) => set({ search: s }),
}));

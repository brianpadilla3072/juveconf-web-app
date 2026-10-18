import { create } from 'zustand';

const currentYear = new Date().getFullYear();

interface GlobalFiltersState {
  selectedYear: number;
  selectedEventId: string;
  yearOptions: number[];
  setSelectedYear: (year: number) => void;
  setSelectedEventId: (id: string) => void;
}

export const useGlobalFiltersStore = create<GlobalFiltersState>((set) => ({
  selectedYear: currentYear,
  selectedEventId: '',
  yearOptions: Array.from({ length: 5 }, (_, i) => currentYear - i),
  setSelectedYear: (year) => set({ selectedYear: year, selectedEventId: '' }),
  setSelectedEventId: (id) => set({ selectedEventId: id }),
}));

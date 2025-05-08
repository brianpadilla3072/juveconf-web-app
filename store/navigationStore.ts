import { create } from 'zustand'

export type Module =
  | ''
  | 'events'
  | 'combos'
  | 'orders'
  | 'payments'
  | 'users'
  | 'settings'

interface NavigationStore {
  activeModule: Module
  setActiveModule: (module: Module) => void
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  activeModule: '',
  setActiveModule: (module) => set({ activeModule: module }),
}))

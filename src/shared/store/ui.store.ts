import { create } from 'zustand';

type BottomTabBarState = 'open' | 'closed';

type UIStore = {
  bottomTabBarState: BottomTabBarState;
  setBottomTabBarState: (state: BottomTabBarState) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  bottomTabBarState: 'open',
  setBottomTabBarState: (state) => set({ bottomTabBarState: state }),
}));

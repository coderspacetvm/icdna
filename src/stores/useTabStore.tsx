import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {TabScreens} from '../routes';

type TabStateType = {
  screen: string;
  setScreen: (screen: string) => void;
};

const initialState: Omit<TabStateType, 'setScreen'> = {
  screen: TabScreens.HOME,
};

export const useTabStore = create<TabStateType>()(
  persist(
    (set) => ({
      ...initialState,
      setScreen: (screen: string) => set({screen}),
    }),
    {
      name: 'tab-storage',
    },
  ),
);

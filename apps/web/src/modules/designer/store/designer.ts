import { create } from 'zustand';
import { DesignerStoreType } from './types';

const initialBrand = {
  name: '',
  industry: '',
  website: '',
  location: '',
  colors: [],
};

export const useDesignerStore = create<DesignerStoreType>((set) => ({
  brand: initialBrand,
  onBoardingStep: 0,
  activeProduct: null,
  isOnBoardingReady: false,
  setBrand: (brand) => set({ brand }),
  setOnBoardingStep: (step) => set({ onBoardingStep: step }),
  resetOnboarding: () =>
    set({ onBoardingStep: 0, brand: initialBrand, activeProduct: null }),
  setActiveProduct: (product) => set({ activeProduct: product }),
  setIsOnBoardingReady: (isReady) => set({ isOnBoardingReady: isReady }),
}));

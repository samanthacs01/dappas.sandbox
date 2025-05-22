import { create } from 'zustand';
import { DesignerStoreType } from './types';

const initialBrand = {
  name: '',
  industry: '',
  website: '',
  location: '',
  colors: [],
  styles: [],
};

export const useDesignerStore = create<DesignerStoreType>((set) => ({
  //States
  brand: initialBrand,
  onBoardingStep: 0,
  activeProduct: null,
  isOnBoardingReady: false,
  selectedTexture: '',
  variantTextures: [],
  activeTexture: null,

  //Actions
  setBrand: (brand) => set({ brand }),
  setOnBoardingStep: (step) => set({ onBoardingStep: step }),
  resetOnboarding: () =>
    set({ onBoardingStep: 0, brand: initialBrand, activeProduct: null }),
  setActiveProduct: (product) => set({ activeProduct: product }),
  setIsOnBoardingReady: (isReady) => set({ isOnBoardingReady: isReady }),
  setSelectedTexture: (texture) => set({ selectedTexture: texture }),
  setVariantTextures: (textures) => set({ variantTextures: textures }),
  setActiveTexture: (texture) => set({ activeTexture: texture }),
}));

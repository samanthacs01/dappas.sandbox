import { PrintableProduct } from '../types/product';

export const enum OnBoardingSteps {
  WELCOME = 0,
  CHAT = 1,
  MANUAL = 2,
  ADD_TO_CART = 3,
  CONFIRM = 4,
}

export type BrandInfo = {
  name?: string;
  industry?: string;
  website?: string;
  location?: string;
  colors?: string[];
  logo?: File;
  styles?: string[];
};

export type DesignerStoreType = {
  brand: BrandInfo;
  onBoardingStep: OnBoardingSteps;
  activeProduct: PrintableProduct | null;
  isOnBoardingReady: boolean;
  variantTextures: string[];
  activeTexture: string;
  isDesigning: boolean;

  setBrand: (brand: BrandInfo) => void;
  setOnBoardingStep: (step: OnBoardingSteps) => void;
  resetOnboarding: () => void;
  setActiveProduct: (product: PrintableProduct) => void;
  setIsOnBoardingReady: (isReady: boolean) => void;
  setVariantTextures: (textures: string[]) => void;
  setActiveTexture: (texture: string) => void;
  setIsDesigning: (is: boolean) => void;
};

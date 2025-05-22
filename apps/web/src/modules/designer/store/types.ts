import { PrintableProduct } from "../types/product";

export const enum OnBoardingSteps {
    WELCOME = 0,
    CHAT = 1,
    MANUAL = 2,
    CONFIRM = 3,
}
    

export type BrandInfo ={
    name?: string;
    industry?: string;
    website?: string;
    location?: string;
    colors?: string[];
    logo?: File;
    styles?: string[];
}

export type DesignerStoreType = {
    brand: BrandInfo;
    onBoardingStep: OnBoardingSteps;
    activeProduct: PrintableProduct | null;
    isOnBoardingReady: boolean;
    selectedTexture: string;
    variantTextures: string[];
    setBrand: (brand: BrandInfo) => void;
    setOnBoardingStep: (step: OnBoardingSteps) => void;
    resetOnboarding: () => void;
    setActiveProduct: (product: PrintableProduct) => void;
    setIsOnBoardingReady: (isReady: boolean) => void;
    setSelectedTexture: (texture: string) => void;
    setVariantTextures: (textures: string[]) => void;
}
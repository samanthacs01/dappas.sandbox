export const enum OnBoardingSteps {
    WELCOME = 0,
    CHAT = 1,
    MANUAL = 2,
    CONFIRM = 3,
}
    

export type BrandInfo ={
    name: string;
    industry: string;
    website: string;
    location: string;
    colors: string[];
    logo: string;
}

export type DesignerStoreType = {
    brand: BrandInfo;
    onBoardingStep: OnBoardingSteps;
    activeProduct: string;
    setBrand: (brand: BrandInfo) => void;
    setOnBoardingStep: (step: OnBoardingSteps) => void;
    resetOnboarding: () => void;
    setActiveProduct: (product: string) => void;
}
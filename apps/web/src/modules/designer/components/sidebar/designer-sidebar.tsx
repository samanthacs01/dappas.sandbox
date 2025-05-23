import { useEffect } from 'react';
import { useDesignerStore } from '../../store/designer';
import { OnBoardingSteps } from '../../store/types';
import useGenerateDesigns from './hooks/use-generate-designs';
import AddToCartContainer from './steps/add-to-cart/add-to-cart-container';
import InteractiveGeneration from './steps/interactive/interactive';
import ManualOnboardingFormContainer from './steps/manual/manual-form-container';
import OnBoardingWelcome from './steps/welcome/welcome';

const DesignerSidebar = () => {
  const onboardingStep = useDesignerStore((state) => state.onBoardingStep);
  const activeProduct = useDesignerStore((state) => state.activeProduct);
  const setOnBoardingStep = useDesignerStore(
    (state) => state.setOnBoardingStep,
  );
  const brand = useDesignerStore((state) => state.brand);
  const resetOnboarding = useDesignerStore((state) => state.resetOnboarding);
  const { generateDesign } = useGenerateDesigns();

  useEffect(() => {
    return () => {
      resetOnboarding();
    };
  }, []);

  const onGenerateNewDesigns = async () => {
    await generateDesign(brand);
  };

  const getStepComponent = () => {
    switch (onboardingStep) {
      case OnBoardingSteps.WELCOME:
        return (
          <OnBoardingWelcome
            onChangeToManualStep={() =>
              setOnBoardingStep(OnBoardingSteps.MANUAL)
            }
            activeProduct={activeProduct?.id ?? ''}
          />
        );
      case OnBoardingSteps.CHAT:
        return <p>Chat with the Assistant!</p>;
      case OnBoardingSteps.MANUAL:
        return <ManualOnboardingFormContainer />;
      case OnBoardingSteps.ADD_TO_CART:
        return <AddToCartContainer />;
      case OnBoardingSteps.REFINE_DESIGN:
        return (
          <InteractiveGeneration onGenerateNewDesigns={onGenerateNewDesigns} />
        );
      case OnBoardingSteps.CONFIRM:
        return <p>Confirm your design!</p>;
      default:
        return <p>Unknown step!</p>;
    }
  };

  return (
    <div className="flex flex-col h-full mb-4  px-12 py-8 bg-white min-w-[40%] max-w-[40%] ">
      {getStepComponent()}
    </div>
  );
};

export default DesignerSidebar;

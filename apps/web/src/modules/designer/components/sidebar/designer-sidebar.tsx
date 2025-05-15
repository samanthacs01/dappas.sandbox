import { useDesignerStore } from '../../store/designer';
import { OnBoardingSteps } from '../../store/types';
import ManualOnboardingFormContainer from './steps/manual/manual-form-container';
import OnBoardingWelcome from './steps/welcome/welcome';

const DesignerSidebar = () => {
  const onboardingStep = useDesignerStore((state) => state.onBoardingStep);
  const activeProduct = useDesignerStore((state) => state.activeProduct);
  const setOnBoardingStep = useDesignerStore(
    (state) => state.setOnBoardingStep,
  );

  const getStepComponent = () => {
    switch (onboardingStep) {
      case OnBoardingSteps.WELCOME:
        return (
          <OnBoardingWelcome
            onChangeToManualStep={() =>
              setOnBoardingStep(OnBoardingSteps.MANUAL)
            }
            activeProduct={activeProduct}
          />
        );
      case OnBoardingSteps.CHAT:
        return <p>Chat with the Assistant!</p>;
      case OnBoardingSteps.MANUAL:
        return <ManualOnboardingFormContainer />;
      case OnBoardingSteps.CONFIRM:
        return <p>Confirm your design!</p>;
      default:
        return <p>Unknown step!</p>;
    }
  };

  return (
    <div className="flex flex-col h-full mb-4  px-16 py-12 bg-white w-[650px]">
      {getStepComponent()}
    </div>
  );
};

export default DesignerSidebar;

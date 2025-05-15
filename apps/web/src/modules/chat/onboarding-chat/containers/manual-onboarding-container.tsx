import ManualOnboardingFormContainer from './manual-onboarding-form-container';
import OnBoardingPreviewContainer from './onboarding-preview-container';

const ManualOnboardingContainer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-full overflow-hidden">
      <ManualOnboardingFormContainer />
      <div className="col-span-3">
        <OnBoardingPreviewContainer />
      </div>
    </div>
  );
};

export default ManualOnboardingContainer;

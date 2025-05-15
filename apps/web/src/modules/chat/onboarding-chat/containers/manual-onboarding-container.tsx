import ManualOnboardingFormContainer from './manual-onboarding-form-container';

const ManualOnboardingContainer = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 h-full overflow-hidden">
      <ManualOnboardingFormContainer />
    </div>
  );
};

export default ManualOnboardingContainer;

import { PackageProvider } from '@/store/package-info';
import OnBoarding from '../components/onboarding';

const OnBoardingContainer = () => {
  return (
    <PackageProvider>
      <OnBoarding />
    </PackageProvider>
  );
};

export default OnBoardingContainer;

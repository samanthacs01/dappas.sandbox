import BusinessBanner from '@/core/components/common/banner/business-banner';
import HeroContainer from '@/modules/hero/container/hero-container';

export default async function Home() {
  return (
    <div className="w-full space-y-2 h-screen overflow-y-auto">
      <BusinessBanner />
      <HeroContainer />
    </div>
  );
}

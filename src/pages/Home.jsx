import HeroSection from "../components/home/HeroSection";
import WhySection from "../components/home/WhySection";
import WhatIsSection from "../components/home/WhatIsSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import KeyPropertiesSection from "../components/home/KeyPropertiesSection";
import UseCasesSection from "../components/home/UseCasesSection";
import ComparisonSection from "../components/home/ComparisonSection";
import GetStartedSection from "../components/home/GetStartedSection";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <WhySection />
      <WhatIsSection />
      <HowItWorksSection />
      <KeyPropertiesSection />
      <UseCasesSection />
      <ComparisonSection />
      <GetStartedSection />
    </div>
  );
}
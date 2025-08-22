import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import IntroSection from '@/components/IntroSection';
import BenefitsSection from '@/components/BenefitsSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import GallerySection from '@/components/GallerySection';
import RegistrationSection from '@/components/RegistrationSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <IntroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <GallerySection />
        <RegistrationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

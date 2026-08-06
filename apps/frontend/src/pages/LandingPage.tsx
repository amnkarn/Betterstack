import Navbar from '@/components/Landing/Navbar';
import Hero from '@/components/Landing/Hero';
import Features from '@/components/Landing/Features';
import HowItWorks from '@/components/Landing/HowItWorks';
import Pricing from '@/components/Landing/Pricing';
import Testimonials from '@/components/Landing/Testimonials';
import Footer from '@/components/Landing/Footer';
import IntegrationsTicker from '@/components/Landing/IntegrationsTicker';


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <IntegrationsTicker />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <Footer />
    </div>
  );
}

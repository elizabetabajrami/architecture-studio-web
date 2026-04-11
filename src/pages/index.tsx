import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/sections/home/HeroSection";
import AboutPreview from "@/sections/home/AboutPreview";
import ServicesSection from "@/sections/home/ServicesSection";
import PortfolioPreview from "@/sections/home/PortfolioPreview";
import ContactCTA from "@/sections/home/ContactCTA";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <main>
        <HeroSection />
        <AboutPreview />
        <ServicesSection />
        <PortfolioPreview />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}
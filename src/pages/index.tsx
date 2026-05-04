import type { GetStaticProps } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/sections/home/HeroSection";
import AboutPreview from "@/sections/home/AboutPreview";
import ServicesSection from "@/sections/home/ServicesSection";
import PortfolioPreview from "@/sections/home/PortfolioPreview";
import ContactCTA from "@/sections/home/ContactCTA";

type PortfolioItem = {
  _id: string;
  title: string;
  category: string;
  mainImage?: string;
  imageUrl?: string;
  description?: string;
};

type HomePageProps = {
  portfolioItems: PortfolioItem[];
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/portfolio");
    const data = await response.json();

    return {
      props: {
        portfolioItems: Array.isArray(data) ? data : [],
      },
      revalidate: 60,
    };
  } catch {
    return {
      props: {
        portfolioItems: [],
      },
      revalidate: 60,
    };
  }
};

export default function HomePage({ portfolioItems }: HomePageProps) {
  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <PortfolioPreview initialItems={portfolioItems} />
        <AboutPreview />
       
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
}

import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ClientsSection from "./components/ClientsSection";
import ContactSection from "./components/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white w-full">
      <Navbar />
      <HeroCarousel />
      <ServicesSection />
      <ClientsSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}

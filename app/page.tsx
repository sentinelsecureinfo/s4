import Navbar from "./components/Navbar";
import HeroCarousel from "./components/HeroCarousel";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroCarousel />
    </main>
  );
}

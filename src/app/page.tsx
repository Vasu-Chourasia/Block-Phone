import Navbar from "@/components/Navbar";
import Scrollytelling from "@/components/Scrollytelling";
import SpecsSection from "@/components/SpecsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-x-clip">
      {/* Sticky header */}
      <Navbar />

      {/* Main scrollytelling section */}
      <main>
        <Scrollytelling />
        
        {/* Hardware specifications section */}
        <SpecsSection />
      </main>

      {/* Corporate footer and sustainability pledge */}
      <Footer />
    </div>
  );
}


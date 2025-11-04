import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="font-mono text-sm leading-8 text-black dark:text-white">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-auto">
        <Navbar />
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <Hero />
      </div>
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
        <Footer />
      </div>
    </div>
  );
}

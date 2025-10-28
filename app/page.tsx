import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import SnapSection, { SnapContainer } from "@/components/SnapSection";
import LoomEmbed from "@/components/LoomEmbed";

export default function Home() {
  return (
    <div className="h-screen font-mono text-sm leading-8 text-black dark:text-white bg-black">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-auto">
        <Navbar />
      </div>

      {/* <Hero /> */}

      <SnapContainer>
        <SnapSection id="hero">
          <Hero />
        </SnapSection>
        <SnapSection id="demo">
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-center justify-center w-full px-2 sm:w-3/5"> 
              <LoomEmbed 
                videoId="f35d5fa69cde4d04b3caefe4046610ce"
                sid="d6f02fc9-6c5e-4c29-b95f-c5c240ac2a7d"
                className="items-center justify-center"
              />
            </div>
          </div>
        </SnapSection>
      </SnapContainer>
      
      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
        <Footer />
      </div>
    </div>
  );
}

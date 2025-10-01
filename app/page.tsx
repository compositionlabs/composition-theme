import config from "@/components/config";
import Container from "@/components/Container";
import FluidScene from "@/components/FluidScene";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SnapSection, { SnapContainer } from "@/components/SnapSection";

export default function Home() {
  return (
    <div className="h-screen font-mono text-sm leading-8 text-black dark:text-white bg-black">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-auto">
        <Navbar />
      </div>
      
      {/* Snap Scrolling Container */}
      <SnapContainer className="pt-24 pb-20">
        {/* Fluid Scene Section */}
        <SnapSection id="hero">
          <div className="relative h-full w-full">
            <FluidScene text="JACOBIAN" />
            {/* Scroll indicator */}
            {/* <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10">
              <div className="flex flex-col items-center animate-bounce">
                <svg 
                  className="w-6 h-6 text-white/70" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div> */}
          </div>
        </SnapSection>
        
        {/* About Section */}
        <SnapSection id="about" className="bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white text-left">{config.landingPageTitle}</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto text-left">
              {config.textOne}
            </p>
          </div>
        </SnapSection>
        
        {/* Features Section */}
        <SnapSection id="features" className="bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real-time interactive fluid simulation with customizable parameters and stunning visual effects.
            </p>
          </div>
        </SnapSection>
        
        {/* Get Started Section */}
        <SnapSection id="get-started" className="bg-gradient-to-b from-gray-800 to-black flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Get Started</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of developers and designers using Jacobian for their creative projects.
            </p>
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

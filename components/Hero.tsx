import Container from "./Container";
import config from "./config";
import CTA from "./CTA";
import FluidScene from "./FluidScene";

export default function Hero() {
	return (
        // <Container type="hero">
            <div className="relative flex justify-center w-full h-full min-h-[60vh] bg-transparent pointer-events-none">
                <div className="flex flex-col justify-center w-full gap-12 h-full z-10" style={{ pointerEvents: 'auto' }}>
                    <div className="flex flex-col flex-grow w-full h-full justify-center items-center">
                        <Container type="jumbotron-title">
                            <h1 className="text-5xl font-medium leading-tight bg-gradient-to-r from-[#4C6EF5] to-[#5B6EF5] text-transparent bg-clip-text">
                                {config.landingPageTitle}
                            </h1>
                        </Container>
                    </div>
                </div>
            </div>
        // </Container>
	);
}
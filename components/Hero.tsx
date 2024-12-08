import Container from "./Container";
import config from "./config";
import CTA from "./CTA";

export default function Hero() {
	return (
        <Container type="hero">
            <div className="relative flex justify-center w-full h-full min-h-[60vh]">
                <div className="flex flex-col justify-center w-full gap-12 h-full z-10" style={{ pointerEvents: 'auto' }}>
                    <div className="flex flex-col flex-grow w-full h-full justify-center items-center">
                        <Container type="jumbotron-title">
                            <h1 className="text-5xl font-medium leading-tight bg-gradient-to-r from-[#4C6EF5] to-[#5B6EF5] text-transparent bg-clip-text">
                                {config.landingPageTitle.toLowerCase()}
                            </h1>
                        </Container>
                        <CTA 
                            title="Have a use case in mind?"
                            buttonText="Talk to us"
                        />
                    </div>
                </div>
            </div>
        </Container>
	);
}
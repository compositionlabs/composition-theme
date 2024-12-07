import Container from "./Container";
import config from "./config";
import CTA from "./CTA";

export default function Hero() {
	return (
        <Container type="hero">
            <div className="relative flex justify-center w-full h-full">
                <div className="flex flex-col justify-start w-full gap-8 h-full z-10" style={{ pointerEvents: 'auto' }}>
                    <div className="flex flex-col flex-grow w-full h-full justify-center items-center my-auto">
                        <Container type="jumbotron-title">
                            {config.landingPageTitle.toLowerCase()}
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
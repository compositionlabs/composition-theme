import Container from "./Container";
import LandingFlow from "./LandingFlow";

export default function Hero() {
	return (
		<Container type="full">
            <div className="relative flex justify-center w-full h-full">
                <div className="absolute flex justify-start w-full gap-8 h-12 bg-gradient-to-b from-primary to-transparent top-0 z-100"></div>
                <div className="absolute flex justify-start w-full gap-8 h-full z-10">
                    <LandingFlow />
                </div>
                <div className="absolute flex flex-col justify-between z-40">
                    <h1 className="text-6xl font-bold text-white">Welcome to the future of web development</h1>
                    <h1 className="text-6xl font-bold text-white">Welcome to the future of web development</h1>
                </div>
            </div>
		</Container>
	);
}
import Container from "./Container";
import LandingFlow from "./LandingFlow";

export default function Hero() {
	return (
		<Container type="full">
            <div className="relative flex justify-center w-full h-full">
                <div className="absolute flex justify-start w-full gap-8 h-full z-10" style={{ pointerEvents: 'auto' }}>
                    <LandingFlow />
                </div>
                <div className="absolute flex flex-col justify-between w-full h-full z-40" style={{ pointerEvents: 'none' }}>
                    <div className="absolute flex justify-start w-full gap-8 h-16 bg-gradient-to-b from-primary to-transparent top-0 z-100"></div>
                    <div>
                        <h1 className="text-6xl font-bold text-white">Welcome to the future of web development</h1>
                    </div>
                    <div className="absolute flex justify-start w-full gap-8 h-16 bg-gradient-to-t from-primary to-transparent bottom-0 z-100"></div>
                </div>
            </div>
		</Container>
	);
}
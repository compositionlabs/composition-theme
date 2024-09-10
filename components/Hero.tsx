import config from "./config";
import Container from "./Container";
import LandingFlow from "./LandingFlow";

export default function Hero() {
	return (
		<Container type="full">
            <div className="relative flex justify-center w-full h-full">
                <div className="bg-primary flex justify-start w-full gap-8 h-full z-10" style={{ pointerEvents: 'auto' }}>
                    {/* <LandingFlow /> */}
                </div>
                {/* <div className="absolute flex flex-col justify-between w-full h-full z-40" style={{ pointerEvents: 'none' }}>
                    <div className="absolute flex justify-start w-full gap-8 h-16 bg-gradient-to-b from-primary to-transparent top-0 z-100"></div>
                    <Container>
                        <div className="flex flex-col w-full gap-4 mb-auto mt-16">
                            <div className="flex flex-col gap-4 max-w-[65%] backdrop-filter backdrop-blur-xl bg-opacity-[0%] p-8 z-100 bg-white rounded-lg">
                                <h1 className="font-bold text-white text-5xl w-full">{config.title}</h1>
                                <p className="text-white text-xl">{config.subtitle}</p>
                            </div>
                        </div>
                    </Container>
                    <div className="absolute flex justify-start w-full gap-8 h-16 bg-gradient-to-t from-primary to-transparent bottom-0 z-100"></div>
                </div> */}
            </div>
		</Container>
	);
}
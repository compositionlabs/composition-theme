"use client";

import Container from "./Container";
import config from "./config";
import Typewriter from "./Typewriter";

export default function Hero() {
	return (
        <Container type="hero">
            <div className="flex flex-col gap-8 w-full items-center">
                <h1 className="text-center text-4xl md:text-6xl font-medium text-foreground max-w-5xl w-full">
                    <Typewriter text={config.landingPageTitle} />
                </h1>
            </div>
        </Container>
	);
}

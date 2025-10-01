"use client";

import Container from "./Container";
import config from "./config";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

export default function Hero() {
	return (
        <Container type="primary">
            <div className="relative flex justify-center w-full h-full min-h-[60vh] bg-transparent pointer-events-none">
                <div className="flex flex-col justify-center w-full gap-12 h-full z-10" style={{ pointerEvents: 'auto' }}>
                    <div className="flex flex-col flex-grow w-full h-full justify-center items-center gap-4">
                            <h1 className="text-left text-5xl font-medium text-white">
                                {config.landingPageTitle}
                            </h1>
                            <p className="text-left text-white text-xl max-w-5xl p-5">
                                {config.textOne}
                            </p>
                            <div className="flex w-full max-w-5xl justify-start px-5">
                                <Button 
                                    className="rounded-none group"
                                    onClick={() => {
                                        document.getElementById('demo')?.scrollIntoView({ 
                                            behavior: 'smooth' 
                                        });
                                    }}
                                >
                                    Demo 
                                    <ArrowDown className="size-4 text-black group-hover:text-white ml-2" />
                                </Button>
                            </div>
                    </div>
                </div>
            </div>
        </Container>
	);
}
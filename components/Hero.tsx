"use client";

import Container from "./Container";
import config from "./config";
import { Button } from "./ui/button";
import { ArrowDown } from "lucide-react";

export default function Hero() {
	return (
        <Container type="hero">
            <div className="relative flex justify-center w-full h-full min-h-[60vh] bg-transparent">
                <div className="flex flex-col justify-center w-full gap-12 h-full z-10">
                    <div className="flex flex-col flex-grow h-full justify-center gap-8 mx-auto px-2">
                            <h1 className="text-left text-5xl font-medium text-white">
                                {config.landingPageTitle}
                            </h1>
                            <p className="text-left text-white text-xl max-w-5xl">
                                {config.textOne}
                            </p>
                            <div className="flex w-full max-w-5xl justify-start">
                                <Button 
                                    className="rounded-none group"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const demoElement = document.getElementById('demo');
                                        if (demoElement) {
                                            // Try scrollIntoView first
                                            demoElement.scrollIntoView({ 
                                                behavior: 'smooth',
                                                block: 'start'
                                            });
                                            
                                            // Fallback for mobile browsers
                                            setTimeout(() => {
                                                const container = document.querySelector('.snap-y');
                                                if (container) {
                                                    container.scrollTo({
                                                        top: demoElement.offsetTop,
                                                        behavior: 'smooth'
                                                    });
                                                }
                                            }, 100);
                                        }
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
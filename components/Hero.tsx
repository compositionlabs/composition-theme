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
                                    className="rounded-none group touch-manipulation"
                                    onTouchStart={() => {}} // Enable touch events
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        
                                        const demoElement = document.getElementById('demo');
                                        const container = document.querySelector('.snap-y') as HTMLElement;
                                        
                                        if (demoElement && container) {
                                            // Disable scroll snap temporarily for smooth scrolling
                                            container.style.scrollSnapType = 'none';
                                            
                                            // Calculate exact scroll position
                                            const containerRect = container.getBoundingClientRect();
                                            const elementRect = demoElement.getBoundingClientRect();
                                            const scrollTop = container.scrollTop + elementRect.top - containerRect.top;
                                            
                                            // Force scroll with multiple fallbacks
                                            container.scrollTo({
                                                top: scrollTop,
                                                behavior: 'smooth'
                                            });
                                            
                                            // Re-enable scroll snap after animation
                                            setTimeout(() => {
                                                container.style.scrollSnapType = 'y proximity';
                                            }, 1000);
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
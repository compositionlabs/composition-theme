"use client";

import Container from "./Container";
import config from "./config";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import LoomEmbed from "./LoomEmbed";

export default function Hero() {
	return (
        <Container type="hero">
            <div className="flex flex-col gap-8 w-full items-center">
                <h1 className="text-left text-6xl font-medium text-white max-w-5xl w-full">
                    {config.landingPageTitle}
                </h1>
                <p className="text-left text-white text-xl max-w-5xl w-full">
                    {config.textOne}
                </p>
                <div className="flex w-full max-w-5xl">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="rounded-none">
                                Demo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl">
                            <LoomEmbed 
                                videoId="f35d5fa69cde4d04b3caefe4046610ce"
                                sid="d6f02fc9-6c5e-4c29-b95f-c5c240ac2a7d"
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Container>
	);
}
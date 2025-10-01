"use client";

import Container from "@/components/Container";
import config from "@/components/config";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useEffect, useState } from "react";

const useCases = [
	{
		title: "social media agents",
		href: "/usecases/social-agents",
	},
];

export default function Navbar() {
	const [scrollProgress, setScrollProgress] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			const progress = (scrollTop / docHeight) * 100;
			setScrollProgress(progress);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<nav className="flex flex-col w-full justify-center h-24 relative">
			<div className="flex w-full justify-center items-center">
				<Container type="primary">
					<div className="flex justify-between items-center text-2xl font-medium text-primary border border-gray-50/40 rounded-full py-2 px-2">
						<div className="text-white font-mono text-lg px-4">
							Jacobian
						</div>
						<Button>
							Login
						</Button>
					</div>
				</Container>
			</div>
			{/* Scroll progress bar */}
			<div className="absolute bottom-0 left-0 h-0.5 bg-white/20 w-full">
				<div 
					className="h-full bg-white/70 transition-all duration-150 ease-out"
					style={{ width: `${scrollProgress}%` }}
				/>
			</div>
		</nav>
  );
}
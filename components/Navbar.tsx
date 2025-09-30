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

const useCases = [
	{
		title: "social media agents",
		href: "/usecases/social-agents",
	},
];

export default function Navbar() {
	return (
		<nav className="flex flex-col w-full justify-center h-24">
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
		</nav>
  );
}
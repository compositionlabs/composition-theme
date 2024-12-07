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
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-8">
							<Link href={config.logoUrl} className="items-center text-primary text-2xl font-medium py-4">{config.logoName.toLowerCase()}</Link>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex items-center gap-1 font-light hover:text-primary">
									use cases
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56" onSelect={() => false}>
									{useCases.map((useCase) => (
										<DropdownMenuItem key={useCase.href} className="py-3">
											<Link href={useCase.href} className="w-full">{useCase.title}</Link>
										</DropdownMenuItem>
									))}
									<div className="px-2 py-4 border-t mt-2">
										<p className="text-sm text-muted-foreground mb-2">Looking for something else?</p>
										<Link href={config.getStartedUrl}>
											<Button variant="secondary" className="w-full">
												Get Started
											</Button>
										</Link>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex gap-4">
							<Link href={config.getStartedUrl}>
								<Button variant="default">Get Started</Button>
							</Link>
						</div>
					</div>
				</Container>
			</div>
		</nav>
  );
}
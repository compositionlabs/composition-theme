"use client";

import Container from "@/components/Container";
import config from "@/components/config";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react"

export default function Navbar() {
	return (
		<nav className="flex flex-col w-full justify-center h-24 relative">
			<div className="flex w-full justify-center items-center">
				<Container type="primary">
					<div className="flex justify-between items-center text-2xl font-medium text-primary border border-gray-50/40 py-2 px-2 bg-white/20 backdrop-blur-md">
						<div className="flex items-center px-2">
							<div className="text-primary-foreground flex items-center justify-center rounded-md">
								<Image src="/logo.svg" alt={config.logoName} width={20} height={20} className="size-6 fill-white" />
							</div>
							<div className="text-white font-mono text-lg px-4">
								{config.logoName}
							</div>
						</div>
						<Link href="https://app.jacobian.co/login" target="_blank" rel="noopener noreferrer">
							<Button className="bg-primary-foreground text-black rounded-none">
								Login <ArrowUpRight className="size-4 ml-1" />
							</Button>
						</Link>
					</div>
				</Container>
			</div>
		</nav>
  );
}
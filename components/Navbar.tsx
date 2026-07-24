"use client";

import Container from "@/components/Container";
import config from "@/components/config";
import Image from "next/image";

export default function Navbar() {
	return (
		<nav className="flex flex-col w-full justify-center h-24 relative">
			<div className="flex w-full justify-center items-center">
				<Container type="primary">
					<div className="flex justify-between items-center text-2xl font-medium text-primary py-2 px-2">
						<div className="flex items-center px-2">
							<div className="text-primary-foreground flex items-center justify-center rounded-md">
								<Image src="/logo.svg" alt={config.logoName} width={20} height={20} className="size-6" />
							</div>
							<div className="text-foreground font-mono text-lg px-4">
								{config.logoName}
							</div>
						</div>
					</div>
				</Container>
			</div>
		</nav>
  );
}

"use client";

import Container from "@/components/Container";
import config from "@/components/config";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="w-full h-max font-mono">
			<div className="flex w-full justify-center items-center h-full">
				<Container type="primary">
					<div className="flex justify-between gap-6 items-center px-4 my-auto h-full">
						<div className="flex items-center align-middle gap-8 h-full">
							<Link href={config.logoUrl} className="items-center text-black dark:text-white text-lg font-semibold">
								{config.logoName}
							</Link>
						</div>
						<div className="flex items-center gap-4 h-full">
							<Link href="/about" className="text-black dark:text-white text-lg font-light">
								about
							</Link>
						</div>
					</div>
				</Container>
			</div>
		</nav>
  );
}
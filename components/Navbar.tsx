import Container from "@/components/Container";
import config from "@/components/config";

export default function Navbar() {
	return (
		<nav className="flex flex-col w-full justify-center h-16 bg-primary">
			<div className="flex w-full justify-center items-center">
				<Container>
					<p className="text-white text-2xl font-medium">{config.logoName}</p>
				</Container>
			</div>
		</nav>
  );
}
const containerTypes: Record<string, string> = {
	"primary": "w-full px-2 max-w-7xl mx-auto flex flex-col py-12 overflow-visible bg-transparent",
	"hero": "w-full px-2 max-w-7xl mx-auto flex flex-col py-12 overflow-visible bg-transparent",
	"feature": "py-12",
	"full": "w-full h-full",
	"jumbotron-title": "flex text-primary text-center text-7xl font-medium py-12 flex-grow justify-center items-center",
	"footer": "w-full px-2 max-w-7xl mx-auto flex flex-col overflow-visible bg-transparent",
}

export default function Container({
	type = "primary",
	children,
	className,
}: Readonly<{
	type?: string;
	children: React.ReactNode;
	className?: string;
}>) {
  return (
	<div className={"flex h-full " + containerTypes[type] + " " + className}>
		{children}
	</div>
  );
}
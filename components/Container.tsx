const containerTypes: Record<string, string> = {
	"primary": "w-full sm:p-0 mx-auto flex flex-col overflow-visible h-full",
	"hero": "w-4/5 h-full",
	"feature": "py-12",
	"full": "w-full h-full",
	"jumbotron-title": "flex text-primary text-center text-7xl font-medium py-12 flex-grow justify-center items-center",
}

export default function Container({
	type = "primary",
	children,
}: Readonly<{
	type?: string;
	children: React.ReactNode;
}>) {
  return (
	<div className={"flex h-full " + containerTypes[type]}>
		{children}
	</div>
  );
}
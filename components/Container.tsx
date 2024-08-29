const containerTypes: Record<string, string> = {
	"primary": "w-full max-w-7xl mx-auto px-4",
	"feature": "py-12",
	"full": "w-full h-full",
}

export default function Container({
	type = "primary",
	children,
}: Readonly<{
	type?: string;
	children: React.ReactNode;
}>) {
  return (
	<div className={"flex h-full w-full " + containerTypes[type]}>
		{children}
	</div>
  );
}
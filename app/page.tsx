import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col flex-grow justify-center items-center w-full font-mono text-sm leading-8 text-black dark:text-white bg-transparent">
      <main className="w-full h-full flex flex-col justify-center items-center">
        <Hero />
      </main>
    </div>
  );
}

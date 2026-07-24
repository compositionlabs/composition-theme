import Image from "next/image";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black">
      <div className="absolute top-6 left-6 flex items-center gap-2.5 text-white">
        <Image src="/logo.svg" alt="Jacobian" width={28} height={28} className="size-7" />
        <span className="text-base tracking-wide">Jacobian</span>
      </div>
      <h1 className="typewriter">AI-native metal production</h1>
    </main>
  );
}

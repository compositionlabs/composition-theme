import AutomateButton from "@/components/AutomateButton";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-[#0f0f0f] text-white font-mono">
      <h1 className="text-4xl font-normal mb-8 text-center">
        building AI workflows doesn't need to be so painful...
      </h1>
      <AutomateButton />
    </div>
  );
}
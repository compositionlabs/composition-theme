import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full font-mono text-sm leading-8 text-black dark:text-white max-w-6xl m-auto px-4 md:px-0">
      <main>
        <section id="how-do-i-use-it" className="mt-4 mb-12">
          <h1 className="text-[1.5em] font-bold">How do I use it?</h1>
          <p className="text-sm leading-relaxed my-3">Finetune our pre-trained model on at least 100 simulations. If your simulations are CFD, now you can run CFD simulations on novel geometries in seconds. The same logic applies for any simulation type.</p>
          <p className="text-sm leading-relaxed my-3">Mach-1.5 was finetuned on 2,500 car aerodynamics simulations.</p>
        </section>

        {/* <!-- WHAT WE'VE DONE --> */}
        <section id="how-is-this-different-from-surrogate-modeling" className="mb-4">
          <h2 className="text-[1.5em] font-bold mb-3">How is this different from surrogate modeling?</h2>
          <p className="text-sm leading-relaxed my-3">GPT is to Natural Language Processing what Mach (our model) is to Surrogate Modeling. Our model has a more general understanding of how physics affects geometries than traditional reduced order models.</p>
          <p className="text-sm leading-relaxed my-3">This means that Mach will model nonlinear physics on novel geometries more accurately.</p>
        </section>
      </main>
    </div>
  );
}

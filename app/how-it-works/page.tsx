import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full font-mono text-sm leading-8 text-black dark:text-white max-w-6xl m-auto px-4 md:px-0">
      <main>
        <section id="how-do-i-use-it" className="mt-4 mb-12">
          <h1 className="text-[1.5em] font-bold">How do I use it?</h1>
          <p className="text-sm leading-relaxed my-3">Finetune our pre-trained model on at least 100 simulations. If your simulations were CFD, now you can run CFD simulations on novel geometries and boundary conditions in seconds. The same logic applies for any other type of simulation.</p>
          <p className="text-sm leading-relaxed my-3">Mach-1.5 was finetuned on 2,500 car aerodynamics simulations.</p>
        </section>

        {/* <!-- WHAT WE'VE DONE --> */}
        <section id="how-is-this-different-from-surrogate-modeling" className="mb-4">
          <h2 className="text-[1.5em] font-bold mb-3">How is this different from surrogate modeling?</h2>
          <p className="text-sm leading-relaxed my-3">GPT is to Natural Language Processing (NLP) what Mach (our model) is to Surrogate Modeling. This is the next evolution in surrogate modeling.</p>
          <p className="text-sm leading-relaxed my-3">Traditional AI-enabled ROMs requires a lot of data to train on a narrow use case specific model that doesn’t actually understand physics or geometries.</p>
          <p className="text-sm leading-relaxed my-3">Our model understands physics and how it affects geometries more generally than traditional ROMs.</p>
          <p className="text-sm leading-relaxed my-3">This allows our model to model nonlinear physics on novel geometries more accurately than other ROMs.</p>
        </section>
      </main>
    </div>
  );
}

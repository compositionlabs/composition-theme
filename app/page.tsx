import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full font-mono text-sm leading-8 text-black dark:text-white bg-white">
      <main>
        <section id="who-we-are" className="mt-4">
          <h1 className="text-[1.5em] font-bold">Who We Are</h1>
          <p className="text-[0.8em] leading-relaxed">Hi! We&apos;re Noah and Chinmay.</p>

          <div className="flex justify-center flex-wrap gap-12 mt-4">
            <figure className="text-center inline-block">
              <Image 
                src="/assets/noahheadshot.jpg" 
                alt="Photo of Noah" 
                width={150}
                height={150}
                className="rounded-full object-cover shadow-lg w-[150px] h-[150px]"
              />
              <figcaption className="mt-3 text-[1em] font-bold text-gray-700 dark:text-gray-300">
                Noah Evers
              </figcaption>
            </figure>
            <figure className="text-center inline-block">
              <Image 
                src="/assets/chinmayheadshot.jpg" 
                alt="Photo of Chinmay" 
                width={150}
                height={150}
                className="rounded-full object-cover shadow-lg w-[150px] h-[150px]"
              />
              <figcaption className="mt-3 text-[1em] font-bold text-gray-700 dark:text-gray-300">
                Chinmay Shrivastava
              </figcaption>
            </figure>
          </div>
        </section>

        {/* <!-- WHAT WE'VE DONE --> */}
        <section id="what-weve-done" className="mb-4">
          <h2 className="text-[1.5em] font-bold mb-2">What We&apos;ve Done</h2>
          <ul className="text-sm space-y-1 list-disc pl-5 leading-relaxed">
            <li>Studied and researched at Harvard, IIT Roorkee, and Brown</li>
            <li>Published several studies and a patent</li>
            <li>Founded and sold a company that improved coffee with neuroscience</li>
            <li>Featured in Scientific American, NPR, US News</li>
            <li>Built AI automations for dozens of companies</li>
            <li>Trained a knowledge graph over the internet to provide personalized learning to 1,200 people</li>
            <li>Built an AI system that outperformed o1 on GPQA Biology 3 months before it was released</li>
            <li>2nd place in a finite element analysis competition with 5,000+ participants</li>
            <li>Worked in reinforcement learning, deep learning, computational mechanics, cognitive science, and generative AI</li>
          </ul>
        </section>

        {/* <!-- WHAT WE'RE DOING NOW --> */}
        <section id="what-were-doing-now" className="mb-12">
          <h2 className="text-[1.5em] font-bold mb-2">What We&apos;re Doing Now</h2>
          <p className="text-sm leading-relaxed">
          Accelerating mechanical simulations with AI @ <b>CompLabs</b>
          </p>
        </section>
      </main>
    </div>
  );
}

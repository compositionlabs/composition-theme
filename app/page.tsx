import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full font-mono text-sm leading-8 text-black dark:text-white bg-white">
      <main>
        <section id="who-we-are" className="mt-4">
          <h1 className="text-[1.5em] font-bold">Who We Are</h1>
          <p className="text-[0.8em]">Hi! We're Noah and Chinmay. We met while working together on multi-agent LLM reasoning research.</p>

          <div className="flex justify-center flex-wrap gap-12 mt-4">
            <figure className="text-center inline-block">
              <img 
                src="assets/noahheadshot.jpg" 
                alt="Photo of Noah" 
                className="w-[150px] h-[150px] rounded-full object-cover shadow-lg"
              />
              <figcaption className="mt-3 text-[1em] font-bold text-gray-700 dark:text-gray-300">
                Noah Evers
              </figcaption>
            </figure>
            <figure className="text-center inline-block">
              <img 
                src="assets/chinmayheadshot.jpg" 
                alt="Photo of Chinmay" 
                className="w-[150px] h-[150px] rounded-full object-cover shadow-lg"
              />
              <figcaption className="mt-3 text-[1em] font-bold text-gray-700 dark:text-gray-300">
                Chinmay Shrivastava
              </figcaption>
            </figure>
          </div>
        </section>

        {/* <!-- WHAT WE'VE DONE --> */}
        <section id="what-weve-done" className="mb-4">
          <h2 className="text-[1.5em] font-bold mb-2">What We've Done</h2>
          <ul className="text-[0.8em] -space-y-2 list-disc pl-5">
            <li>Studied and researched at Harvard, MIT, IIT Roorkee, UCLA, and Brown</li>
            <li>Published several studies and a patent</li>
            <li>Founded and sold a company that improved coffee with neuroscience</li>
            <li>Featured in Scientific American, NPR, US News</li>
            <li>Built AI automations for dozens of companies</li>
            <li>Trained a knowledge graph over the internet to provide personalized learning to 1,200 people, 3 months before ChatGPT was released</li>
            <li>Beat o1 on GPQA Biology 3 months before it was released</li>
            <li>2nd place in a finite element analysis competition with 5,000+ participants</li>
            <li>Worked in reinforcement learning, deep learning, computational mechanics, cognitive science, and generative AI</li>
          </ul>
        </section>

        {/* <!-- WHAT WE'RE DOING NOW --> */}
        <section id="what-were-doing-now" className="mb-12">
          <h2 className="text-[1.5em] font-bold mb-2">What We're Doing Now</h2>
          <p className="text-[0.8em]">
          Building a foundational model to reduce the time and compute required for mechanical simulations @ <b>Composition Labs</b>
          </p>
        </section>
      </main>
    </div>
  );
}
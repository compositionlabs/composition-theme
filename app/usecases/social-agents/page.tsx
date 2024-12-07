import { Feature, FeatureProps } from "@/components/Feature";
import Hero from "@/components/socialagents/Hero";
import UseCases, { UseCasesProps } from "@/components/UseCases";
import CTA from "@/components/CTA";

const features: FeatureProps[] = [
    {
        title: "We work with you",
        description: "Deploy agents where your customers are across Facebook, Linkedin, X, Nextdoor, and more",
        imgSrc: "/assets/platforms.png",
    },
    {
        title: "Find people who are hard to find",
        description: "Our agents find the focused communities to find people that are best for you",
        imgSrc: "/assets/communities.png",
        reverse: true,
    },
    {
        title: "Lead Generation and Qualification",
        description: "Based on your criteria, our agents will qualify leads and schedule meetings with your sales team",
        imgSrc: "/assets/icp.png",
    }
];

const useCases: UseCasesProps = {
    videos: [
        {
            src: "/assets/fbmarketplace_posting.mov",
            description: "Generate leads from Facebook Marketplace",
            thumbnail: "/assets/facebook_logo.png",
        },
        {
          src: "/assets/facebook_dm.mov",
          description: "Convert leads into customers with personalized messages",
          thumbnail: "/assets/facebook_logo.png",
        },
        {
          src: "/assets/nextdoor_posting.mov",
          description: "Generate leads from Nextdoor",
          thumbnail: "/assets/nextdoor_logo.png",
        },
        {
          src: "/assets/nextdoor_comment_dm.mov",
          description: "Convert leads into customers with personalized comments and messages",
          thumbnail: "/assets/nextdoor_logo.png",
        }
    ]
}
  

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full text-white font-mono">
      <Hero />
      {features.map((feature, index) => (
        <Feature key={index} {...feature} />
      ))}
      <UseCases {...useCases} />
      <CTA />
    </div>
  );
}
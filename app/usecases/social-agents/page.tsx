import { Feature, FeatureProps } from "@/components/Feature";
import Hero from "@/components/socialagents/Hero";
import UseCases, { UseCasesProps } from "@/components/UseCases";
import CTA from "@/components/CTA";

const features: FeatureProps[] = [
    {
        title: "Find your customers",
        description: "Our AI agents find and join the communities where your customers hang out",
        imgSrc: "/assets/communities.png",
        reverse: true,
    },
    {
        title: "Connect with your customers",
        description: "Automate personalized interactions with your customers on Facebook, Linkedin, X, Nextdoor, and more",
        imgSrc: "/assets/platforms.png",
    },
    {
        title: "Get to a sale",
        description: "Based on your criteria, our AI agents will qualify leads and schedule meetings with your sales team",
        imgSrc: "/assets/icp.png",
        reverse: true,
    }
];

const useCases: UseCasesProps = {
    videos: [
        {
            src: "/assets/fbmarketplace_posting.mov",
            description: "Automated posting on Facebook Marketplace",
            thumbnail: "/assets/facebook_logo.png",
        },
        {
          src: "/assets/facebook_dm.mov",
          description: "AI agent determines that a FB group post is relevant and DMs poster",
          thumbnail: "/assets/facebook_logo.png",
        },
        {
          src: "/assets/nextdoor_posting.mov",
          description: "Automated posting on Nextdoor",
          thumbnail: "/assets/nextdoor_logo.png",
        },
        {
          src: "/assets/nextdoor_comment_dm.mov",
          description: "AI agent finds relevant posts, comments on them, and DMs poster",
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
import Image from "next/image";
import Container from "./Container";

interface FeatureProps {
  title: string;
  description: string;
  imgSrc?: string;
  media?: React.ReactNode;
  reverse?: boolean;
}

const Feature: React.FC<FeatureProps> = ({ 
  title, 
  description, 
  imgSrc, 
  media, 
  reverse = false 
}) => {
  return (
    <Container type="primary">
      <div className="py-16 overflow-visible">
        <div 
          className={`
            container mx-auto px-4 
            flex flex-col md:flex-row items-center 
            gap-12 md:gap-16
            ${reverse ? 'md:flex-row-reverse' : ''}
          `}
        >
          <div className="flex-1 space-y-6 transform transition-all duration-500 hover:scale-105">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-primary">
              {title}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {description}
            </p>
          </div>
          <div className="flex-1 transform transition-all duration-500 hover:-translate-y-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-300 bg-transparent">
              {imgSrc ? (
                <Image 
                  src={imgSrc} 
                  alt={title} 
                  className="w-full h-full object-cover"
                  width={1000}
                  height={1000}
                />
              ) : media}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export type { FeatureProps };
export { Feature };
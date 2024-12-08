import Container from "./Container";
import Image from "next/image";

export interface FeatureProps {
    title: string;
    description: string;
    imgSrc: string;
    reverse?: boolean;
}

const Feature = ({ title, description, imgSrc, reverse = false }: FeatureProps) => {
    return (
        <Container type="primary">
            <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center justify-between py-16`}>
                <div className="flex flex-col gap-4 flex-1">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-[#4C6EF5] to-[#5B6EF5] text-transparent bg-clip-text">
                        {title}
                    </h2>
                    <p className="text-white text-lg">
                        {description}
                    </p>
                </div>
                <div className="flex-1">
                    <Image
                        src={imgSrc}
                        alt={title}
                        width={500}
                        height={500}
                        className="w-full h-auto"
                    />
                </div>
            </div>
        </Container>
    );
};

export { Feature };
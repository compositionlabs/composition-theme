import React from 'react';
import Container from './Container';
import { Button } from './ui/button';
import Link from 'next/link';
import config from './config';

interface CTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const CTA: React.FC<CTAProps> = ({
  title = "Ready to get started?",
  description = "Join thousands of satisfied users today.",
  buttonText = "Get Started",
  onButtonClick,
}) => {
  return (
    <Container type="primary">
      <div className="py-8 w-full sm:w-4/5 mx-auto">
        <div className="flex flex-col gap-3 justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h2 className="text-2xl font-medium tracking-tight bg-gradient-to-r from-[#4C6EF5] to-[#5B6EF5] text-transparent bg-clip-text">
              {title}
            </h2>
          </div>
          <div className="">
            <Link href={config.getStartedUrl}>
              <Button
                onClick={onButtonClick}
                className="text-2xl bg-gradient-to-r from-[#4C6EF5] to-[#5B6EF5] text-white hover:opacity-90 rounded-full px-8 py-6"
              >
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CTA;

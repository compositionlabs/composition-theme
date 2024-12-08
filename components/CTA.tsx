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
      <div className="text-primary py-16 border rounded-lg bg-white w-full sm:w-4/5 mx-auto">
        <div className="flex flex-col gap-4 justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left">
            <h2 className="text-lg font-medium tracking-tight drop-shadow-sm">
              {title}
            </h2>
          </div>
          <div className="">
            <Link href={config.getStartedUrl}>
              <Button
                onClick={onButtonClick}
                className="text-lg"
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

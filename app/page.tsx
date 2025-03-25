'use client';

import dynamic from 'next/dynamic';

const HeatmapComponent = dynamic(
  () => import('@/components/Heatmap'),
  { ssr: false }
);

export default function Home() {
  return (
    <div className="flex flex-col justify-center w-full font-mono text-sm leading-8 text-black dark:text-white bg-white">
      <HeatmapComponent />
    </div>
  );
}

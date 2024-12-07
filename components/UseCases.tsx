"use client";

import React, { useState } from 'react';
import Container from './Container';

interface Video {
  src: string;
  description: string;
  thumbnail?: string;
}

interface UseCasesProps {
  videos: Video[];
}

const UseCases: React.FC<UseCasesProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <Container type="primary">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-primary">Examples of our Agents in Action</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {videos.map((video, index) => (
          <div
          key={index}
          className="relative aspect-square cursor-pointer group"
          onClick={() => setSelectedVideo(video)}
        >
          <video 
            src={video.src}
            className="w-full h-full object-cover rounded-lg"
            poster={video.thumbnail}
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
            <p className="text-white text-center p-4">{video.description}</p>
          </div>
        </div>
      ))}

      {/* Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            <video 
              src={selectedVideo.src}
              controls
              autoPlay
              className="w-full rounded-lg"
              ref={(videoElement) => {
                if (videoElement) {
                  videoElement.playbackRate = 4;
                }
              }}
            />
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full p-2 hover:bg-gray-100"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
    </Container>
  );
};

export type { UseCasesProps };
export default UseCases;

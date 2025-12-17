import React from 'react';
import { TypewriterEffect, TypewriterEffectSmooth } from './TypewriterEffect';

export default function TypewriterDemo() {
  // Example with single-line text
  const singleLineWords = [
    {
      text: "Welcome to Fitmate",
      className: "text-blue-500",
    }
  ];

  // Example with multi-line text
  const multiLineWords = [
    {
      text: "Track your fitness.\nMonitor your nutrition.\nAchieve your goals.",
      className: "text-purple-500",
    }
  ];

  // Example with multiple styled words
  const styledWords = [
    {
      text: "Fitmate:",
      className: "text-blue-500",
    },
    {
      text: "Your",
      className: "text-blue-300",
    },
    {
      text: "AI",
      className: "text-purple-500 font-bold",
    },
    {
      text: "fitness",
      className: "text-green-500",
    },
    {
      text: "companion.",
      className: "text-blue-300",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4 space-y-16">
      <div className="w-full max-w-2xl">
        <h2 className="text-white text-lg mb-4">Single Line Example:</h2>
        <TypewriterEffect words={singleLineWords} />
      </div>
      
      <div className="w-full max-w-2xl">
        <h2 className="text-white text-lg mb-4">Multi Line Example:</h2>
        <TypewriterEffect words={multiLineWords} />
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-white text-lg mb-4">Multiple Styled Words:</h2>
        <TypewriterEffect words={styledWords} />
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-white text-lg mb-4">Smooth Animation Example:</h2>
        <TypewriterEffectSmooth words={singleLineWords} />
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-white text-lg mb-4">Smooth Animation Multi-line:</h2>
        <TypewriterEffectSmooth words={multiLineWords} />
      </div>
    </div>
  );
}
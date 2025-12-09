import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, Target, Zap, Heart } from 'lucide-react';
// suggester
const MotivationTipsBox = () => {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      type: 'motivation',
      icon: <Heart className="w-4 h-4" />,
      title: 'Daily Motivation',
      content: 'Every small step counts! Your 75% protein goal shows real dedication.',
      color: 'text-pink-400'
    },
    {
      type: 'tip',
      icon: <Zap className="w-4 h-4" />,
      title: 'Quick Tip',
      content: 'Try adding 5g more fiber tomorrow - your gut will thank you!',
      color: 'text-yellow-400'
    },
    {
      type: 'challenge',
      icon: <Target className="w-4 h-4" />,
      title: 'Mini Challenge',
      content: 'Drink 2 extra glasses of water today for better hydration.',
      color: 'text-blue-400'
    },
    {
      type: 'achievement',
      icon: <Trophy className="w-4 h-4" />,
      title: 'Great Progress!',
      content: 'You\'re 1.6kg closer to your goal - that\'s amazing consistency!',
      color: 'text-purple-400'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const currentTipData = tips[currentTip];

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-200">Daily Boost</h3>
        <div className="flex space-x-1">
          {tips.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentTip ? 'bg-purple-500' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-start space-x-3 mb-4">
          <div className={`${currentTipData.color} mt-1`}>
            {currentTipData.icon}
          </div>
          <div className="flex-1">
            <h4 className={`text-sm font-medium ${currentTipData.color} mb-2`}>
              {currentTipData.title}
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {currentTipData.content}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          Tip {currentTip + 1} of {tips.length}
        </div>
        <button className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors text-xs">
          <span>View All Tips</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

export default MotivationTipsBox;
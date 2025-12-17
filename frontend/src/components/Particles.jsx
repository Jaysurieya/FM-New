import React, { useState, useEffect } from 'react';

const GlowEffect = ({ delay = 400 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Generate random positions and movement for dots
  const generateDots = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: Math.random() * 2,
      moveX: (Math.random() - 0.5) * 100,
      moveY: (Math.random() - 0.5) * 50,
      duration: Math.random() * 10 + 5
    }));
  };

  const dots = generateDots(200);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translate(0, 0) scale(1);
          }
          50% { 
            transform: translate(var(--move-x), var(--move-y)) scale(1.2);
          }
        }
        @keyframes sparkleMove {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.2;
          }
          50% { 
            transform: translate(var(--sparkle-x), var(--sparkle-y));
            opacity: 0.8;
          }
        }
        .floating-dot {
          animation: float var(--duration) ease-in-out infinite;
        }
        .moving-sparkle {
          animation: sparkleMove var(--sparkle-duration) ease-in-out infinite;
        }
      `}</style>
      
      <div className={`fixed bottom-0 left-0 right-0 h-48 pointer-events-none z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {/* Main glow background */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-cyan-500/10 to-transparent"></div>
        
        {/* Animated glow pulses */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/10 via-transparent to-transparent animate-pulse"></div>
        

        
        {/* Moving floating dots */}
        {dots.map((dot) => (
          <div
            key={dot.id}
            className="absolute rounded-full bg-cyan-400 floating-dot"
            style={{
              left: `${dot.left}%`,
              top: `${dot.top}%`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              opacity: dot.opacity,
              animationDelay: `${dot.animationDelay}s`,
              boxShadow: `0 0 ${dot.size * 2}px rgba(34, 211, 238, 0.6)`,
              '--move-x': `${dot.moveX}px`,
              '--move-y': `${dot.moveY}px`,
              '--duration': `${dot.duration}s`
            }}
          >
            {/* Additional glow effect for larger dots */}
            {dot.size > 2 && (
              <div 
                className="absolute inset-0 rounded-full bg-cyan-300/30 animate-ping"
                style={{
                  animationDelay: `${dot.animationDelay + 1}s`,
                  animationDuration: '3s'
                }}
              ></div>
            )}
          </div>
        ))}
        
        {/* Moving sparkles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => {
            const sparkleX = (Math.random() - 0.5) * 80;
            const sparkleY = (Math.random() - 0.5) * 40;
            const sparkleDuration = Math.random() * 8 + 4;
            
            return (
              <div
                key={`sparkle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full moving-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  boxShadow: '0 0 4px rgba(255, 255, 255, 0.8)',
                  '--sparkle-x': `${sparkleX}px`,
                  '--sparkle-y': `${sparkleY}px`,
                  '--sparkle-duration': `${sparkleDuration}s`
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GlowEffect;
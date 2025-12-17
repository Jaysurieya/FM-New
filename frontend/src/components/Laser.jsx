import LaserFlow from './LaserFlow';
import { useRef } from 'react';
import Hero from './Hero';
import '../css/Laser.css';
import GlowEffect from './Particles';

// NOTE: You can also adjust the variables in the shader for super detailed customization

/*
// Basic Usage Example:
// <div style={{ height: '500px', position: 'relative', overflow: 'hidden' }}>
//   <LaserFlow />
// </div>
*/

// Main Laser Component with Hero centered
function Laser() {
  const revealImgRef = useRef(null);

  return (
    <div 
      className="laser-container"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', `${x}px`);
          el.style.setProperty('--my', `${y + rect.height * 0.5}px`);
        }
      }}
      onMouseLeave={() => {
        const el = revealImgRef.current;
        if (el) {
          el.style.setProperty('--mx', '-9999px');
          el.style.setProperty('--my', '-9999px');
        }
      }}
    >
      <LaserFlow
        horizontalBeamOffset={0}
        verticalBeamOffset={0.2}
        color="#9879ffff"
        verticalSizing={5}
        wispSpeed={50}
        decay={2.5}
        flowStrength={0}
      />
      
      <div className="hero-box">
        <Hero />
      </div>

      <img
        ref={revealImgRef}
        src="/path/to/image.jpg"
        alt="Reveal effect"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: '0',
          left: '0',
          objectFit: 'cover',
          zIndex: 5,
          mixBlendMode: 'lighten',
          opacity: 0.3,
          pointerEvents: 'none',
          '--mx': '-9999px',
          '--my': '-9999px',
          WebkitMaskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          maskImage: 'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,1) 0px, rgba(255,255,255,0.95) 60px, rgba(255,255,255,0.6) 120px, rgba(255,255,255,0.25) 180px, rgba(255,255,255,0) 240px)',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat'
        }}
      />
      <GlowEffect />
    </div>
  );
}
export default Laser;
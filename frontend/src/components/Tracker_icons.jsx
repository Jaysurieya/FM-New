import React from 'react';
import GlareHover from './GlareHover/GlareHover';
import { 
  Moon, 
  Pill, 
  Droplets, 
  Footprints, 
  Dumbbell, 
  Scale,
} from 'lucide-react';
function AnimatedTooltip() {
  const user = "World";  
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center', justifyContent: 'center'}}>
        <h1 style={{color: 'white', fontSize: '18px', fontWeight: '600', margin: '0'}}>Other Trackers</h1>
        
        <div style={{display: 'flex', gap: '10px',flexDirection: 'row'}}>
          <GlareHover
            width="50px"
            height="50px"
            background="#060010" 
            borderRadius="15px"    
            borderColor="#444"    
            glareColor="#ffffff"   
            >
            <Moon color="#7300ffff" size={24} />
        </GlareHover>
        <GlareHover
            width="50px"
            height="50px"
            background="#060010" // Add a background color to make the container visible
            borderRadius="15px"    // Adjusted for a more circular look
            borderColor="#444"    // Added a subtle border
            glareColor="#ffffff"   // Corrected to a standard 6-digit hex
            >
            <Pill color="#00ff6eff" size={24} />
        </GlareHover>
        <GlareHover
            width="50px"
            height="50px"
            background="#060010" // Add a background color to make the container visible
            borderRadius="15px"    // Adjusted for a more circular look
            borderColor="#444"    // Added a subtle border
            glareColor="#ffffff"   // Corrected to a standard 6-digit hex
            >
            <Droplets color="#0099ffff" size={24} />
        </GlareHover>
        </div>
        <div style={{display: 'flex', gap: '10px',flexDirection: 'row'}}>
          <GlareHover
            width="50px"
            height="50px"
            background="#060010" // Add a background color to make the container visible
            borderRadius="15px"    // Adjusted for a more circular look
            borderColor="#444"    // Added a subtle border
            glareColor="#ffffff"   // Corrected to a standard 6-digit hex
            >
            <Footprints color="#ff4d00ff" size={24} />
        </GlareHover>
        <GlareHover
            width="50px"
            height="50px"
            background="#060010" // Add a background color to make the container visible
            borderRadius="15px"    // Adjusted for a more circular look
            borderColor="#444"    // Added a subtle border
            glareColor="#ffffff"   // Corrected to a standard 6-digit hex
            >
            <Dumbbell color="#cc00ffff " size={24} />
        </GlareHover>
        <GlareHover
            width="50px"
            height="50px"
            background="#060010" // Add a background color to make the container visible
            borderRadius="15px"    // Adjusted for a more circular look
            borderColor="#444"    // Added a subtle border
            glareColor="#ffffff"   // Corrected to a standard 6-digit hex
            >
            <Scale color="cyan" size={24} />
        </GlareHover>
        </div>
    </div>
  );
}
export default AnimatedTooltip;
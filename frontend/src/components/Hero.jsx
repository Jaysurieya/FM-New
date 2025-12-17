import '../css/Hero.css'
import { BackgroundBeams } from "./BackgroundBeams";
import { TypewriterEffect } from "./TypewriterEffect";
import AnimatedContent from "./AnimatedContent/AnimatedContent";
import ShinyText from './ShinyText/ShinyText';
import { useNavigate } from 'react-router-dom';
import TypeText from './TypeText/TypeText';
import GlareHover from './GlareHover/GlareHover';
import { UserPlus2, LogIn } from 'lucide-react';
import { MdDirectionsRun } from 'react-icons/md';

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      {/* <div className="background-container">
        <BackgroundBeams />
      </div> */}

      <div className="content-container">
        <div style={{  paddingBottom: '200px', position: 'fixed' }}>
          <TypeText
            text={["Welcome to Fitmate", "Your AI Fitness Companion"]}
            typingSpeed={100}
            style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: '20px' }}
          />
        </div>
        {/* The fix is here: Added a wrapper div with a min-height */}
        <div style={{ minHeight: '150px', position: 'relative',paddingTop: '170px' }}>
          <TypeText
            text={["Hello there! It’s great to have you on board. I'm FitMate, your new AI fitness partner. \nMy mission is to help you crush your health goals and transform your approach to wellness. Our journey will be personal and engaging, \n starting with our instant meal analysis—just snap a photo of your food, and I'll handle the rest. \nI'll be your guide and motivator, tracking your workouts, celebrating your milestones, and providing encouragement every step of the way. \n Let's do this! "]}
            typingSpeed={1}
            style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', textAlign: 'left', marginBottom: '20px' }}
          />
        </div>
        <div className='flex-row' style={{position:'relative'}}>
          <div onClick={() => navigate('/signup')}>
            <AnimatedContent delay={1.2} distance={150}>
              <GlareHover
                width="130px"
                height="50px"
                background="#060010"
                borderRadius="15px"
                borderColor="#444"
                glareColor="#ffffff"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', cursor: 'pointer' }}
              >
                <MdDirectionsRun color="#7300ffff" size={24} />
                <span style={{ color: '#fff', fontSize: '16px' }}>Get Started</span>
              </GlareHover>
            </AnimatedContent>
          </div>
          <div onClick={() => navigate('/login')}>
            <AnimatedContent delay={1.2} distance={150}>
              <GlareHover
                width="100px"
                height="50px"
                background="#060010"
                borderRadius="15px"
                borderColor="#444"
                glareColor="#ffffff"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', cursor: 'pointer' }}
              >
                <LogIn color="#7300ffff" size={24} />
                <span style={{ color: '#fff', fontSize: '16px' }}>Login</span>
              </GlareHover>
            </AnimatedContent>
          </div>
          {/* <GlowEffect /> */}
        </div>
      </div>
    </div>
  );
};
export default Hero;
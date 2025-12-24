import { useRef, useState,useEffect } from 'react';
import { Home, Search, Bell, PieChart, Package, LogOut ,Salad,UserRound,History} from 'lucide-react';
import TextType from './Texttype';
import Details from './Details';
import "@fontsource/alkatra"; 
import plate from '../../assets/final_plate_3.svg';
import upload from '../../assets/final_upload.svg';
import './css/dashboard.css';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import FloatingChatbot from './Chat';

function Dashboard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [nutrients, setNutrients] = useState({
    protein: 0,
    fats: 0,
    carbs: 0,
    fibre: 0,
    calories: 0,
    Food: ''
  });
  const [todayIntake, setTodayIntake] = useState([]);
  const [logoutProcessing, setLogoutProcessing] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const fetchTodayNutrition = async () => {
      try {
        const token = localStorage.getItem("fitmate_token");
        if (!token) return;

        const res = await axios.post(
          "https://fm-new-2.onrender.com/api/nutrition/fetch_T_details",
          {}, // no body needed
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const log = res.data?.data;

        if (log) {
          setNutrients({
            protein: log.protein || 0,
            fats: log.fats || 0,
            carbs: log.carbs || 0,
            fibre: log.fibre || 0,
            calories: log.calories || 0,
            Food: ""
          });

          setTodayIntake(log.foods || []);
        } else {
          // no log for today → reset
          setNutrients({
            protein: 0,
            fats: 0,
            carbs: 0,
            fibre: 0,
            calories: 0,
            Food: ""
          });
          setTodayIntake([]);
        }
      } catch (error) {
        console.error("Failed to fetch nutrition:", error);
      }
    };

    fetchTodayNutrition();
  }, []);

  // Global axios response interceptor: if any request returns 401, clear auth and redirect
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (resp) => resp,
      (error) => {
        const status = error?.response?.status;
        if (status === 401) {
          console.error('API request after logout or invalid token (401) - clearing auth state');
          clearAuthStorage();
          // navigate to auth page
          try { navigate('/signup'); } catch(e){}
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  function clearAuthStorage() {
    try {
      localStorage.removeItem('fitmate_token');
      sessionStorage.removeItem('fitmate_token');
      // clear other possible keys
      localStorage.removeItem('user');
      // clear cookies by expiring them
      document.cookie.split(';').forEach(function(c) { 
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date(0).toUTCString() + ';path=/');
      });
    } catch (e) {
      console.error('Failed clearing auth storage:', e);
    }
  }

   const handleAddNutrition = async (nutrition) => {
    try {
      const token = localStorage.getItem("fitmate_token");
      console.log("TOKEN 👉", token);

      const res = await axios.post(
        "https://fm-new-2.onrender.com/api/nutrition/add",
        {
          name: nutrition.Food,     // food name
          protein: nutrition.protein,
          fats: nutrition.fats,
          carbs: nutrition.carbs,
          fibre: nutrition.fibre,
          calories: nutrition.calories
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const log = res.data.data;

      // 🔥 update state from backend response
      setNutrients({
        protein: log.protein,
        fats: log.fats,
        carbs: log.carbs,
        fibre: log.fibre,
        calories: log.calories,
        Food: nutrition.Food
      });

      setTodayIntake(log.foods);

    } catch (error) {
      console.error("Failed to add nutrition:", error);
    }
  };

  const handleLogout = async () => {
    setLogoutError(null);
    setLogoutProcessing(true);

    const token = localStorage.getItem('fitmate_token');
    try {
      // Attempt to inform backend to destroy session (best-effort)
      if (token) {
        const res = await axios.post(
          'https://fm-new-2.onrender.com/api/auth/logout',
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status !== 200 && res.status !== 204) {
          throw new Error(`Logout endpoint returned ${res.status}`);
        }
      }

      // Clear client-side auth tokens and sensitive state
      clearAuthStorage();
      setNutrients({ protein: 0, fats: 0, carbs: 0, fibre: 0, calories: 0, Food: '' });
      setTodayIntake([]);

      console.log('Logout successful');
      navigate('/signup');
    } catch (err) {
      console.error('Logout failed:', err?.response || err.message || err);
      setLogoutError(err?.response?.data?.message || err.message || 'Logout failed');
      // keep tokens intact per requirement
    } finally {
      setLogoutProcessing(false);
    }
  };
  

  // change these to control the plate image exact manual size:
  const PLATE_WIDTH = 700;   // px
  const PLATE_HEIGHT = 600;  // px
  const popupVideoRef = useRef(null);
// onClick={() => { closeCamera(popupVideoRef); setOpen(false); }}
  return (
    <div className={"app"}>
    {open && (
        <div className="overlay" >
          <div className="popup" onClick={e => e.stopPropagation()}> 
            <Popup onClose={() => setOpen(false)} videoRef={popupVideoRef} onAddNutrition={handleAddNutrition}/>
          </div>
        </div>
      )}
      <div style={{
        display: 'flex',
        height: '100vh',
        fontFamily: 'Alkatra',
        backgroundColor:'#FFE8D6',
        borderTop: '5px solid #492110',
        borderRight: '5px solid #492110',
        position: 'relative' // keeps absolutely-positioned plate inside this container
      }}>
        {/* Sidebar */}
        <div 
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          style={{
          width: isExpanded ? '280px' : '80px',
          backgroundColor: '#FFE8D6 ',
          display: 'flex',
          flexDirection: 'column',
          border: `5px solid #492110`,
          borderRadius: '0 20px 20px 0',
          transition: 'all 0.3s ease',
          overflow: 'hidden',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}>
          {/* Header */}
          <div style={{
            padding: '24px 20px',
            borderBottom: `1px solid #e5e5e5`,
            display: 'flex',
            justifyContent: isExpanded ? 'flex-start' : 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#492110',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0
              }}>
                <Salad color="#FFE8D6" size={24} />
              </div>
              {isExpanded && (
                <div style={{ whiteSpace: 'nowrap' }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#0a0a0a'
                  }}>Fitmate</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#737373'
                  }}>User@Fitmate.com</div>
                </div>
              )}
            </div>
          </div>

          {/* Search */}
          <div style={{ padding: '20px 20px 16px 20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor:  '#ffffff',
              padding: '10px 14px',
              borderRadius: '10px',
              border: `1px solid #e5e5e5`,
              justifyContent: isExpanded ? 'flex-start' : 'center'
            }}>
              <Search size={18} color={'#737373'} style={{ flexShrink: 0 }} />
              {isExpanded && (
                <input
                  type="text"
                  placeholder="Search..."
                  style={{
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color:'#0a0a0a',
                    fontSize: '14px',
                    width: '100%'
                  }}
                />
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ flex: 1, padding: '8px 12px' }}>
            
            <NavItem icon={<Home size={20} />} label="Dashboard"  isExpanded={isExpanded} /> 
            <NavItem icon={<History size={20} />} label="History"  isExpanded={isExpanded} onClick={() => navigate('/history')}/>
          </nav>

          {/* Footer */}
          <div style={{
            padding: '16px 12px',
            borderTop: `1px solid #e5e5e5`
          }}>
            <NavItem icon={<UserRound size={20} />} label="Profile"  isExpanded={isExpanded} onClick={() => navigate('/profile')} />
            <NavItem icon={<LogOut size={20} />} label="Logout"  isExpanded={isExpanded} onClick={() => 
              handleLogout()} />
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{
          flex: 1,
          backgroundColor: '#FFE8D6',
          paddingLeft: '40px',
          paddingTop: '10px',
          overflowY: 'auto',
          transition: 'all 0.3s ease',
          marginLeft: '80px',
          position: 'relative',    // content sits above plate
          zIndex: 2                 // ensure main content is above the plate (sidebar is 1000)
        }}>
          
          <div  style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <h1 style={{
                fontSize: '32px',
                fontWeight: '700',
                fontFamily:'Alkatra',
                color: '#492110'
              }}>
                HELLO, USER
              </h1>
              <div style={{fontFamily:'Alkatra',paddingBottom:"20px"}}>
                <TextType 
                    text={["Snap. Scan. Stay Fit!","Your Smart Nutrition Guide.","Fuel Your Body With a Single Scan."]}
                    typingSpeed={10}
                    pauseDuration={1500}
                    showCursor={true}
                    cursorCharacter="|"
                    textColors={["#492110"]}
                  />
              </div>
            </div>
          </div>
        </div>

      {/* Plate SVG — BOTTOM LEFT, manual width/height set via PLATE_WIDTH / PLATE_HEIGHT */}
      <div style={{display:"flex",flexDirection:"row"}}>
          <div
            style={{
              position: "fixed",
              left: "2vw",
              bottom: 0,
              width: window.innerWidth < 768
                ? "75vw"
                : window.innerWidth < 1024
                ? "55vw"
                : window.innerWidth < 1440
                ? "48vw"
                : "48vw",
              height: "auto",
              aspectRatio: "7 / 6",
              display: "block",
              zIndex: 2,
              userSelect: "none",
              pointerEvents: "none"
            }}
          >
            <img
              src={plate}
              alt="Plate"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                display: "block",
                opacity: 1
              }}
            />
          </div>  
         <div
          onClick={() => setOpen(true)}
          style={{
            cursor: "pointer",
            position: "fixed",   // stable + no layout reflow
            left: screenWidth < 768
              ? "18vw"
              : screenWidth < 1024
              ? "14vw"
              : screenWidth < 1440
              ? "12vw"
              : "14vw",
            bottom: screenWidth < 768
              ? "15vh"
              : "22vh",
            width: screenWidth < 768
              ? "40vw"
              : screenWidth < 1024
              ? "28vw"
              : screenWidth < 1440
              ? "24vw"
              : "20vw",
            height: "auto",
            aspectRatio: "3 / 2", // keeps design box ratio clean
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            zIndex: 2,
            userSelect: "none"
          }}
        >
            <img
              src={upload}
              alt="Plate"
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                opacity: 1,
                userSelect: 'none',
                pointerEvents: 'none',
                display: 'block'
              }}
            />
          </div>
          <div style={{paddingRight:"20px",paddingTop:"20px",zIndex:3,height:"100%",width:"100%"}}>
            <Details nutrients={nutrients} todayIntake={todayIntake}/>
          </div>
          
      </div>
      </div>
      <FloatingChatbot />
      </div>
    );
  }

  function NavItem({ icon, label, isExpanded, onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '10px',
          cursor: 'pointer',
          marginBottom: '4px',
          backgroundColor: isHovered ? ('#f5f5f5') : 'transparent',
          transition: 'all 0.2s ease',
          color: '#525252',
          justifyContent: isExpanded ? 'flex-start' : 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          {icon}
        </div>
        {isExpanded && (
          <span style={{ fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap' }}>{label}</span>
        )}
      </div>

  );
}

export default Dashboard;

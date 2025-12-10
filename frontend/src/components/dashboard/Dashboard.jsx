import { useState } from 'react';
import { Home, Search, Bell, PieChart, Package, LogOut , GraduationCap, Sun ,Moon,Salad } from 'lucide-react';
import AIChatInput from './Ai';
import TextType from './Texttype';
import Calendar from './Calendar';
import "@fontsource/alkatra"; 
import plate from '../../assets/pla.svg';


function Dashboard() {
  const [isExpanded, setIsExpanded] = useState(false);



  return (
    
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Alkatra',backgroundColor:'#FFE8D6',border: '5px solid #492110' }}>
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
        //boxShadow: isExpanded ? (isDarkMode ? '4px 0 20px rgba(0, 0, 0, 0.5)' : '4px 0 20px rgba(0, 0, 0, 0.1)') : 'none'
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
          <NavItem icon={<Bell size={20} />} label="Notifications"  isExpanded={isExpanded} />
          <NavItem icon={<PieChart size={20} />} label="Analytics"  isExpanded={isExpanded} />
          <NavItem icon={<Package size={20} />} label="Inventory"  isExpanded={isExpanded} />
        </nav>

        {/* Footer */}
        <div style={{
          padding: '16px 12px',
          borderTop: `1px solid #e5e5e5`
        }}>
          <NavItem icon={<LogOut size={20} />} label="Logout"  isExpanded={isExpanded} />
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
        
      }}>
        
        {/* <div style={{
          borderRadius:"10px",
          backgroundColor : "#f5f5f5",
          width:"65%",
          paddingTop:"20px",
          display:"flex",
          flexDirection:"column",
          height: "80vh",
          minHeight: "400px",
          overflow: "hidden"
          }}>
          <AIChatInput />
        </div> */}
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
    </div>
  );
}

function NavItem({ icon, label, isExpanded }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
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
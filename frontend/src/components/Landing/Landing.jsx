import React from "react";
import "@fontsource/alkatra";
import "./Landing.css";
import LandBg from "../../assets/Land_bg.svg";
import {useNavigate} from "react-router-dom";


export default function Hero() {
  const navigate = useNavigate();
  return (
    <div className="hero-container">
      <img src={LandBg} alt="Landing background" className="hero-bg" />
      <button className="hero-button" onClick={() => navigate('/signup')}>Get Started</button>
    </div>
  );
}

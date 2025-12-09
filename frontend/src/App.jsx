  import './App.css';
  import React, { useState, useEffect } from 'react';
  import { Hero } from './components/Hero';
  import { Route , Routes} from 'react-router-dom';
  import Login from './components/Login';
  import Signup from './components/Signup';
  import Dashboard from './components/Dashboard';
  import { Details } from './components/Details';
  import DualScrollPicker from './components/DualScrollPicker';
  import Profile from './components/Profile'; 
  import FloatingChatbot from './components/Chat';
  import About_us from './components/About_us';
  import Laser from './components/Laser';
  import ProfilePage from './components/Profile';
  function App() {

  return (
        <Routes>
          <Route path='/' element={<Laser />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/details' element={<Details />} />
          <Route path='/wheel' element={<DualScrollPicker />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/chat' element={<FloatingChatbot />} />
          <Route path='/about' element={<About_us />} />
          <Route path='/laser' element={<Hero/>} />
          <Route path='/profile' element={<ProfilePage/>} />
        </Routes>
  );
}

export default App;

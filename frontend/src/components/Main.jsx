import React from 'react';
import MagicBento from './MagicBento/MagicBento';
import '../css/Main.css';

export default function MyPage() {
  return (
    <div style={{paddingLeft:"30px"}} >
      <MagicBento enableStars={false} />        
    </div>
  );
}
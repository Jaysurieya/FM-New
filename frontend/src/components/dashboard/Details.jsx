import Calendar from "./Calendar";
import RoundProgress from "./Water_Tracker";
import Food_Tracker from "./Food_Tracker";
import { useState } from "react";

function Details({ nutrients }) {

    // const MAX_VALUES = {
    //   Protein: 100,
    //   Fats: 80,
    //   Carbs: 300,
    //   Fibre: 40,
    //   Calories: 2000
    // };
  
    const MAX_VALUES = {
      Protein: 1,
      Fats: 1,
      Carbs: 1,
      Fibre: 1,
      Calories: 1
    };
  return (
    <div style={{
        display:'flex',
        flexDirection:'column',
        gap:'20px'  
    }}>
        <div style={{
            display:'flex',
            flexDirection:'row',
            gap:'20px'
        }}>
            <RoundProgress />
            <Calendar nutrients={nutrients} maxValues={MAX_VALUES} />
        </div>
        <Food_Tracker nutrients={nutrients}/>
    </div>
  );
}

export default Details;

import Calendar from "./Calendar";
import RoundProgress from "./Water_Tracker";
import Food_Tracker from "./Food_Tracker";

function Details() {
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
            <Calendar />
        </div>
        <Food_Tracker />
    </div>
  );
}

export default Details;

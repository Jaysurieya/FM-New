import Calendar from "./Calendar";
import RoundProgress from "./RoundProgress";

function Details() {
  return (
    <div style={{
        display:'flex',
        flexDirection:'column'
    }}>
        <div style={{
            display:'flex',
            flexDirection:'row',
            gap:'20px'
        }}>
            <RoundProgress />
            <Calendar />
        </div>
    </div>
  );
}

export default Details;

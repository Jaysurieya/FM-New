import Daily from "./Daily";

const overall = {
    backgroundColor: "#FFD5BD",
    height: "380px",
    border: "5px solid #492110",
    borderRadius: 20,
    display: "flex",
}

const daily = {
    // border: "4px solid #492110",
    height:"45%",
    width: "100%",
    margin: "8px",
}


function Food_Tracker() {
  return (
    <div style={overall}>
        <div style={daily}>
            <h1>Daily Goal:</h1>
            <div style={{
              margin: '10px',
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Daily protein={70} fats={50} carbs={250} fibre={30} />
            </div>
             <hr style={{ border: "none", height: 1.5, background: "#492110",margin: "0 auto",width:"95%"}} /> 
            <div style={{paddingTop:"10px"}}>
              <h1> Today's Intake:</h1>
            </div>
        </div>
        <div>

        </div>
    </div>
  );
}

export default Food_Tracker;

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


function Food_Tracker({ nutrients }) {
  return (
    <div style={overall}>
        <div style={daily}>
            <h1 className="ml-2.5">Daily Goal:</h1>
            <div style={{
              margin: '10px',
              display: 'flex',
              flexDirection: 'row',
            }}>
              <Daily
                protein={nutrients.protein}
                fats={nutrients.fats}
                carbs={nutrients.carbs}
                fibre={nutrients.fibre}
              />
            </div>
             <hr style={{ border: "none", height: 1.5, background: "#492110",margin: "0 auto",width:"97%"}} /> 
            <div style={{paddingTop:"10px",marginLeft:"10px"}}>
              <h1> Today's Intake:</h1>
            </div>
        </div>
        <div>

        </div>
    </div>
  );
}

export default Food_Tracker;

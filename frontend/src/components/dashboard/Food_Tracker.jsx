const overall = {
    backgroundColor: "#FFCBAE",
    height: "380px",
    border: "8px solid #492110",
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
        </div>
        <div>

        </div>
    </div>
  );
}

export default Food_Tracker;

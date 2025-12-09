import React, { useState } from 'react';
import '../css/Location.css'; 

const LiveLocationFinder = ({ value, onChange }) => {
  const [address, setAddress] = useState(value || "Your address will appear here");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=a200ecf10d8c439dbb0aa7fdfcf1f96e`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const fetchedAddress = data.results[0].formatted;
        onChange(fetchedAddress);
        setAddress(fetchedAddress);
      } else {
        setError("Address not found for your location.");
      }
    } catch (err) {
      setError("Failed to fetch address from the API.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    setLoading(true);
    setError(null);

    // Check if geolocation is supported by the browser
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    // This is the core function to get the user's position
    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchAddress(latitude, longitude);
      },
      // Error callback
      (err) => {
        setError(`Location access denied: ${err.message}`);
        setLoading(false);
      }
    );
  };

  return (
    <div className='location-container'>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <br />
      <h3>Your Address:</h3>
      <div style={{border: "1px solid #ccc", padding: "10px", borderRadius: "5px"   }}>
        <p>{address}</p>
      </div><br />
      <button onClick={handleGetLocation} disabled={loading} className='location-button'>
        {loading ? 'Getting Location...' : 'Get My Current Address'}
      </button>
      <div className="divider-container">
        <div className="divider-line"></div>
        <span className="divider-text">or</span>
        <div className="divider-line"></div>
      </div>
      <input 
        type='text' 
        placeholder='Enter Your Address' 
        style={{
            border: "1px solid rgb(215, 215, 215)",
            borderRadius: "10px",
            padding: "10px",
            height: "80px" 
        }}
        />
        <div style={{paddingBottom: "20px"}}></div>
    </div>
  );
};

export default LiveLocationFinder;
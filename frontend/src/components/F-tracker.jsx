
import React, { useState, useEffect, useRef } from 'react';
import { Camera, Utensils, Lightbulb, X, Zap, RotateCcw } from "lucide-react";
import GlareHover from './GlareHover/GlareHover';

const MacroStat = ({ label, value, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div style={{
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: `all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1) ${delay}ms`
    }}>
      <p style={{
        margin: '0 0 8px 0',
        fontSize: '14px',
        color: '#555',
        fontWeight: '500'
      }}>
        {label}: <span style={{ fontWeight: '700', color: '#333' }}>{`${value}g`}</span>
      </p>
      <div style={{
        backgroundColor: '#f0f0f0',
        height: '8px',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div
          style={{
            width: `${Math.min(value * 2, 100)}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #7300ff, #8f4dff, #ab7aff)',
            borderRadius: '12px',
            transform: isVisible ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 1s cubic-bezier(0.4, 0.0, 0.2, 1) 0.3s',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            animation: isVisible && value > 0 ? 'shimmer 2s infinite' : 'none'
          }} />
        </div>
      </div>
    </div>
  );
};

const FoodTracker = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pulseButtons, setPulseButtons] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [nutrients, setNutrients] = useState({
    protein: 0,
    fats: 0,
    carbs: 0,
    fibre: 0,
    calories: 0
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    const pulseTimer = setInterval(() => {
      setPulseButtons(true);
      setTimeout(() => setPulseButtons(false), 600);
    }, 4000);

    return () => {
      clearInterval(pulseTimer);
      // Clean up camera stream on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Effect to handle video stream when camera turns on
  useEffect(() => {
    if (isCameraOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.error("Error playing video:", e));
    }
  }, [isCameraOn, stream]);

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob((blob) => {
      const imageUrl = URL.createObjectURL(blob);
      setCapturedImage(imageUrl);

      // Process the image for prediction
      processImageForPrediction(canvas);
    }, 'image/jpeg', 0.9);
  };

  const processImageForPrediction = async (canvas) => {
    setIsProcessing(true);

    // Resize to 224x224 for the model
    const resizedCanvas = document.createElement('canvas');
    const ctx = resizedCanvas.getContext('2d');
    resizedCanvas.width = 224;
    resizedCanvas.height = 224;

    // Draw and resize the image
    ctx.drawImage(canvas, 0, 0, 224, 224);

    // Convert to ImageData and then to array
    const imageData = ctx.getImageData(0, 0, 224, 224);
    const pixels = imageData.data;

    // Convert to normalized RGB array (0-1 range)
    const imageArray = [];
    for (let i = 0; i < pixels.length; i += 4) {
      imageArray.push(
        pixels[i] / 255.0,     // R
        pixels[i + 1] / 255.0, // G
        pixels[i + 2] / 255.0  // B
      );
    }
    
    try {
      // API call to Python server
      const response = await fetch('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageArray }),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const predictionResult = await response.json();
      setPrediction(predictionResult);
  
    } catch (error) {
      console.error("Error making prediction:", error);
      alert("Sorry, we couldn't identify the food. Please try again.");
      setPrediction(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleCamera = async () => {
    if (isCameraOn) {
      // Turn camera OFF
      console.log("Turning camera OFF.");
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
      setCapturedImage(null);
      setPrediction(null);
      setIsProcessing(false);
    } else {
      // Turn camera ON
      console.log("Turning camera ON.");
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please ensure you grant permission.");
      }
    }
  };

  const resetDailyTracking = () => {
    setNutrients({
      protein: 0,
      fats: 0,
      carbs: 0,
      fibre: 0,
      calories: 0
    });
  };

  const getNutritionFromGemini = async (foodName) => {
  // 1. Define the prompt for the AI model.
  const prompt = `Provide/ Give me nutritional information for a standard serving of ${foodName}. 
  Return ONLY a JSON object with these exact keys: 
  {"protein": number, "fats": number, "carbs": number, "fibre": number, "calories": number}
  Values should be in grams except calories which should be kcal.`;

  try { 
      // 2. Make the API call to the correct Gemini model endpoint.
      // Replace 'YOUR_API_KEY' with your actual key, but remember to move this to a backend!
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyA_NRLvH504vk9CO9NQPFo3Y0kj5Ggg78c`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      // 3. Check if the network request itself was successful.
      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      // 4. Parse the JSON response from the API.
      const data = await response.json();

      // 5. Extract the text content from the complex response object.
      const nutritionText = data.candidates[0].content.parts[0].text;
      
      // 6. Clean the text to remove potential markdown formatting (like ```json) and parse it into an object.
      const cleanText = nutritionText.trim().replace(/```json\n?|```\n?/g, '');
      const nutritionData = JSON.parse(cleanText);
      
      // 7. Return the final, clean data object.
      return nutritionData;

    } catch (error) {
      // 8. If anything in the 'try' block fails, log the error and return a default object.
      console.error("Error getting nutrition from Gemini:", error);
      
      // This prevents your app from crashing and provides a fallback.
      return {
        protein: 0,
        fats: 0,
        carbs: 0,
        fibre: 0,
        calories: 0
      };
    }
  };

  const addFoodToTracker = async () => {
    if (prediction) {
      try {
        // Call Gemini API for nutrition data
        const nutritionData = await getNutritionFromGemini(prediction.class);
        
        // Update nutrients state
        setNutrients(prev => ({
          protein: prev.protein + nutritionData.protein,
          fats: prev.fats + nutritionData.fats,
          carbs: prev.carbs + nutritionData.carbs,
          fibre: prev.fibre + nutritionData.fibre,
          calories: prev.calories + nutritionData.calories
        }));
        
        alert(`Added ${prediction.class} to your food tracker!`);
        toggleCamera();
      } catch (error) {
        console.error('Error getting nutrition data:', error);
        alert('Could not get nutrition information');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    const img = new Image();
    img.onload = () => {
      // Once the image is loaded, draw it to the hidden canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        // Now that the canvas has the image, start the prediction
        processImageForPrediction(canvas);
      }
    };
    img.src = imageUrl;

    // Show the modal with the selected image
    setCapturedImage(imageUrl);
    setIsCameraOn(true); // Re-using this state to show the modal

    // Reset the file input so selecting the same file again triggers onChange
    if (event.target) {
      event.target.value = null;
    }
  };

  const calorieGoal = 1450;

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      maxWidth: '350px',
      position: 'relative'
    }}>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        style={{ display: 'none' }}
        accept="image/jpeg, image/png, image/jpg"
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: 'bold',
          margin: '0',
          color: '#ffffff',
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)'
        }}>
          Your Trackers
        </h2>

        {/* Reset Button */}
        <button
          onClick={resetDailyTracking}
          style={{
            background: 'rgba(255, 68, 68, 0.1)',
            border: '1px solid rgba(255, 68, 68, 0.3)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = '#ff4444';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.3)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <RotateCcw color='#ff4444' size={18} />
        </button>
      </div>

      {/* Track Food Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateX(0)' : 'translateX(-30px)',
        transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) 0.2s'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <GlareHover
            width="50px"
            height="50px"
            background="#060010"
            borderRadius="15px"
            borderColor="#444"
            glareColor="#ffffff"
          >
            <Utensils color="#7300ff" size={24} />
          </GlareHover>
          <div>
            <p style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#888',
              transform: 'translateY(0)',
              transition: 'all 0.3s ease'
            }}>
              Track Food
            </p>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '14px',
              color: '#888',
              opacity: 0.8
            }}>
              {nutrients.calories}/{calorieGoal} Cal
            </p>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <GlareHover
            width="50px"
            height="50px"
            background="#060010"
            borderRadius="15px"
            borderColor="#444"
            glareColor="#ffffff"
          >
            <button
              onClick={toggleCamera}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isCameraOn ? '#ff4444' : '#888',
                fontSize: '24px',
                transform: pulseButtons ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
                borderRadius: '12px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              }}
            >
              {isCameraOn ? <X color='#ff4444' size={24} /> : <Camera color='#7300ff' size={24} />}
            </button>
          </GlareHover>
          <button
            onClick={handleUploadClick}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #7300ff, #8f4dff)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              transform: pulseButtons ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
              boxShadow: '0 4px 15px rgba(115, 0, 255, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #8f4dff, #7300ff)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(115, 0, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, #7300ff, #8f4dff)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(115, 0, 255, 0.3)';
            }}>
            +
          </button>
        </div>
      </div>

      {/* Camera View Modal */}
      {isCameraOn && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '600px',
          height: '80vh',
          backgroundColor: '#000',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>

          {capturedImage ? (
            /* Captured Image View */
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px'
            }}>
              {/* Captured Image */}
              <img
                src={capturedImage}
                alt="Captured food"
                style={{
                  maxWidth: '100%',
                  maxHeight: '50%',
                  borderRadius: '15px',
                  objectFit: 'contain'
                }}
              />

              {/* Processing/Results */}
              <div style={{
                textAlign: 'center',
                color: 'white',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '15px'
              }}>
                {isProcessing ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid #7300ff',
                      borderTop: '3px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span style={{ fontSize: '18px' }}>Analyzing food...</span>
                  </div>
                ) : prediction ? (
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{
                      margin: '0 0 10px 0',
                      color: '#7300ff',
                      fontSize: '28px',
                      fontWeight: 'bold'
                    }}>
                      {prediction.class.charAt(0).toUpperCase() + prediction.class.slice(1)}
                    </h3>
                    <p style={{
                      margin: 0,
                      opacity: 0.8,
                      fontSize: '16px'
                    }}>
                      Confidence: {prediction.confidence}%
                    </p>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                marginTop: 'auto',
                paddingBottom: '60px'
              }}>
                {/* Dismiss Button */}
                <button
                  onClick={toggleCamera}
                  style={{
                    background: 'rgba(255, 68, 68, 0.2)',
                    border: '2px solid rgba(255, 68, 68, 0.5)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 68, 68, 0.4)';
                    e.currentTarget.style.borderColor = '#ff4444';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <X color='#ff4444' size={24} />
                </button>

                {prediction && (
                  <button
                    onClick={addFoodToTracker}
                    style={{
                      background: 'linear-gradient(135deg, #7300ff, #8f4dff)',
                      border: 'none',
                      borderRadius: '30px',
                      padding: '12px 24px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 20px rgba(115, 0, 255, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 30px rgba(115, 0, 255, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(115, 0, 255, 0.4)';
                    }}
                  >
                    <Zap size={18} />
                    Add to Tracker
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Live Camera View */
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px'
            }}>
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '70%',
                  borderRadius: '15px',
                  objectFit: 'cover',
                  backgroundColor: '#222'
                }}
              />

              {/* Camera Controls */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '30px'
              }}>
                {/* Close Button */}
                <button
                  onClick={toggleCamera}
                  style={{
                    background: 'rgba(255, 68, 68, 0.2)',
                    border: '2px solid rgba(255, 68, 68, 0.5)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 68, 68, 0.4)';
                    e.currentTarget.style.borderColor = '#ff4444';
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255, 68, 68, 0.5)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <X color='#ff4444' size={24} />
                </button>

                {/* Shutter Button */}
                <button
                  onClick={captureImage}
                  style={{
                    background: 'linear-gradient(135deg, #7300ff, #8f4dff)',
                    border: '3px solid rgba(255, 255, 255, 0.8)',
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 6px 25px rgba(115, 0, 255, 0.5)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = '0 8px 35px rgba(115, 0, 255, 0.7)';
                    e.currentTarget.style.borderColor = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(115, 0, 255, 0.5)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                  }}
                >
                  <div style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Camera color='#7300ff' size={20} />
                  </div>
                </button>
              </div>

              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'center',
                fontSize: '16px',
                margin: 0
              }}>
                Point camera at food and tap to capture
              </p>
            </div>
          )}

          {/* Hidden canvas for image processing */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}

      {/* Overlay when camera is on */}
      {isCameraOn && (
        <div
          onClick={toggleCamera}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 999,
            cursor: 'pointer'
          }}
        />
      )}

      {/* Macros Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '24px 28px',
        marginBottom: '32px'
      }}>
        <MacroStat label="Protein" value={nutrients.protein} delay={600} />
        <MacroStat label="Fats" value={nutrients.fats} delay={700} />
        <MacroStat label="Carbs" value={nutrients.carbs} delay={800} />
        <MacroStat label="Fibre" value={nutrients.fibre} delay={900} />
      </div>

      {/* Creative Suggest Ideas Button */}
      <GlareHover
        width="300px"
        height="50px"
        background="#060010"
        borderRadius="15px"
        borderColor="#444"
        glareColor="#ffffff"
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
          <Lightbulb color="#7300ff" />
          <h1 style={{ color: "#7300ff", fontSize: "18px", margin: 0 }}>Suggest Some Ideas</h1>
        </div>
      </GlareHover>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        @keyframes buttonShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default FoodTracker;
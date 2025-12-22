import { Camera, Download, X, Check,Utensils,Goal } from 'lucide-react';
import {  useRef, useState ,useEffect} from 'react';

const overall={
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    width:"100%",
    height:"100%",
    gap:"20px",
}
const openImagePicker = (fileRef) => {
  if (fileRef?.current) {
    fileRef.current.click();
  }
};

const openCamera = async (videoRef) => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });

    if (videoRef?.current) {
      videoRef.current.srcObject = stream;
    }
  } catch (err) {
    console.error("Camera not opening:", err);
  }
};

const closeCamera = (videoRef) => {
  try {
    if (videoRef?.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();    

      tracks.forEach(track => track.stop()); // 🛑 stop camera

      videoRef.current.srcObject = null; // clear preview
    }
  } catch (err) {
    console.error("Camera not closing:", err);
  }
};



function Popup({onClose, videoRef: externalVideoRef,onAddNutrition}) {
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const imageRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const canvasRef = useRef(null);

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nutrients, setNutrients] = useState({
  protein: 0,
  fats: 0,
  carbs: 0,
  fibre: 0,
  calories: 0,
  Food: ''
});
  const [hasFetchedNutrients, setHasFetchedNutrients] = useState(false);



  const handleClose = () => {
    closeCamera(videoRef);
    onClose();
  };

  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImage(true);
      setVideo(false);
      setCam_up(false);
    }
  };
    useEffect(() => {
        return () => {
        // 🔥 runs when popup is removed (outside click, X click, etc.)
        closeCamera(videoRef);
        };
    }, []);
    const [video,setVideo] = useState(false);
    const [cam_up, setCam_up] = useState(true);
    const [image,setImage] = useState(false);


    // const sendImageToModel = async () => {
    //   if (!imagePreview) return;

    //   setLoading(true);
    //   setPrediction(null);

    //   try {
    //     // Load image
    //     const img = new Image();
    //     img.src = imagePreview;
    //     await new Promise(res => (img.onload = res));

    //     // Create 224x224 canvas
    //     const canvas = document.createElement("canvas");
    //     canvas.width = 224;
    //     canvas.height = 224;
    //     const ctx = canvas.getContext("2d");

    //     ctx.drawImage(img, 0, 0, 224, 224);

    //     // Extract pixels
    //     const imageData = ctx.getImageData(0, 0, 224, 224).data;

    //     // RGBA → normalized RGB
    //     const pixels = [];
    //     for (let i = 0; i < imageData.length; i += 4) {
    //       pixels.push(
    //         imageData[i] / 255,
    //         imageData[i + 1] / 255,
    //         imageData[i + 2] / 255
    //       );
    //     }

    //     // Send to ML backend
    //       const res = await fetch("https://food-ml-api.onrender.com/predict", {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({ image: pixels }),
    //       });

    //       if (!res.ok) throw new Error("Prediction failed");

    //       const data = await res.json();
    //       setPrediction(data);

    //       await fetchNutritionFromCSV(data.class);
    //       setNutrients(prev => ({ ...prev, Food: data.class }));

    //     } catch (err) {
    //       console.error(err);
    //       alert("Prediction failed. Try again.");
    //     } finally {
    //       setLoading(false);
    //     }
    //   };


  const sendImageToModel = async () => {
  if (!imagePreview) return;

  setLoading(true);
  setPrediction(null);

  try {
    const img = new Image();
    img.src = imagePreview;

    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    const canvas = document.createElement("canvas");
    canvas.width = 224;
    canvas.height = 224;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, 224, 224);

    const imageData = ctx.getImageData(0, 0, 224, 224).data;

    const pixels = [];
    for (let i = 0; i < imageData.length; i += 4) {
      pixels.push(
        imageData[i] / 255,
        imageData[i + 1] / 255,
        imageData[i + 2] / 255
      );
    }

    if (pixels.length !== 224 * 224 * 3) {
      throw new Error("Invalid image preprocessing");
    }

    const res = await fetch(
      "https://food-ml-api.onrender.com/predict",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: pixels }),
      }
    );

    if (!res.ok) throw new Error("Prediction failed");

    const data = await res.json();
    setPrediction(data);

    await fetchNutritionFromCSV(data.class);
    setNutrients(prev => ({ ...prev, Food: data.class }));

  } catch (err) {
    console.error(err);
    alert("Prediction failed. Try again.");
  } finally {
    setLoading(false);
  }
};


//   const sendImageToModel = async () => {
//   if (!imagePreview) return;

//   setLoading(true);
//   setPrediction(null);

//   try {
//     // 🔹 Convert base64 imagePreview → Blob
//     const blob = await fetch(imagePreview).then(res => res.blob());

//     // 🔹 Create FormData and attach image
//     const formData = new FormData();
//     formData.append("image", blob, "image.jpg");

//     // 🔹 Send to ML backend (NO headers!)
//     const res = await fetch("https://fm-new.onrender.com/predict", {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok) throw new Error("Prediction failed");

//     const data = await res.json();
//     setPrediction(data);

//     await fetchNutritionFromCSV(data.class);
//     setNutrients(prev => ({ ...prev, Food: data.class }));

//   } catch (err) {
//     console.error(err);
//     alert("Prediction failed. Try again.");
//   } finally {
//     setLoading(false);
//   }
// };


    /**
     * Sends food name to Gemini AI,
     * gets nutrition details,
     * and sends them to Dashboard
     */
    const fetchNutritionFromCSV = async (foodName) => {
      try {
        const response = await fetch("https://fm-new-2.onrender.com/api/nutrition/fetch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodName })
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`CSV lookup failed: ${errText}`);
        }

        const data = await response.json();

        setNutrients(prev => ({
          ...prev,
          protein: data.protein,
          fats: data.fats,
          carbs: data.carbs,
          fibre: data.fibre,
          calories: data.calories
        }));
        console.log("Fetched nutrients from CSV:", data);

        setHasFetchedNutrients(true);
        // onClose(); // optional

      } catch (err) {
        console.error("CSV error:", err);
        alert("Food not found in database. Please try another item.");
      }
    };



  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"20px",
    fontFamily: "Alkatra, sans-serif",fontSize:"25px"}}>
        <div style={{display:"flex",flexDirection:"row", alignItems:"center", justifyContent:"space-between", width:"100%"}}>
            <p >Upload Your Food Image</p>
            <X size={30} style={{cursor:"pointer"}} onClick={handleClose}/>
        </div>
        {loading && (
            <p style={{ fontSize: "18px" }}>🧠 Analyzing image...</p>
          )}

          {prediction && !loading && (
            <div style={{ textAlign: "center" }}>
              <p style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:"15px"}}>
                <Utensils/> <b>{prediction.class}</b>
              </p>
              <p style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",gap:"15px"}}>
                <Goal /> Confidence: <b>{prediction.confidence}%</b>
              </p>
            </div>
          )}
        {hasFetchedNutrients && !loading && (
          <div style={{ fontSize: "18px", color: "#492110" }}>
            <p>Proteins:{nutrients.protein},Fats:{nutrients.fats},Carbs:{nutrients.carbs},Fibre:{nutrients.fibre} </p>
          </div>
        )}
        {video && (
          <div style={{ position:"relative", width:"700px", height:"450px" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: "700px",
                height: "450px",
                borderRadius: 10,
                objectFit: "cover"
              }}
            />
            {/* Capture button centered below the video */}
            <button
              onClick={() => {
                try {
                  const videoEl = videoRef.current;
                  if (!videoEl) return;
                  const canvas = canvasRef.current || document.createElement('canvas');
                  canvas.width = 700;
                  canvas.height = 450;
                  const ctx = canvas.getContext('2d');
                  // Draw current frame to canvas (cover-style crop)
                  const vw = videoEl.videoWidth;
                  const vh = videoEl.videoHeight;
                  // target aspect 700x450 (approx 1.556)
                  const targetW = 700;
                  const targetH = 450;
                  const targetAspect = targetW / targetH;
                  const srcAspect = vw / vh;
                  let sx = 0, sy = 0, sw = vw, sh = vh;
                  if (srcAspect > targetAspect) {
                    // source wider than target, crop width
                    sh = vh;
                    sw = sh * targetAspect;
                    sx = (vw - sw) / 2;
                    sy = 0;
                  } else {
                    // source taller than target, crop height
                    sw = vw;
                    sh = sw / targetAspect;
                    sx = 0;
                    sy = (vh - sh) / 2;
                  }
                  ctx.drawImage(videoEl, sx, sy, sw, sh, 0, 0, targetW, targetH);
                  const url = canvas.toDataURL('image/png');
                  setImagePreview(url);
                  setImage(true);
                  setVideo(false);
                  closeCamera(videoRef);
                } catch (err) {
                  console.error('Capture failed:', err);
                }
              }}
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#FFCBAE",
                border: "5px solid #492110",
                cursor: "pointer"
              }}
              aria-label="Capture photo"
            >
              <Camera size={36} color="#492110" />
            </button>
            <canvas ref={canvasRef} style={{ display:"none" }} />
          </div>
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              width: "700px",
              height: "450px",
              borderRadius: 10,
              objectFit: "cover"
            }}
          />
        )}
        {imagePreview && (
          <div style={{ display:"flex", gap:"16px", marginTop:"12px", alignItems:"center", justifyContent:"center" }}>
            {!prediction && !loading && <button
              onClick={() => {
                sendImageToModel();
              }}
              style={{
                display:"flex",
                alignItems:"center",
                gap:"8px",
                padding:"10px 16px",
                borderRadius: 10,
                background: "#FFCBAE",
                border: "3px solid #492110",
                cursor:"pointer"
              }}
            >
              <Check size={20} color="#492110" />
              <span style={{ color:"#492110" }}>Continue</span>
            </button>}
            {prediction && !hasFetchedNutrients && !loading && <button
              onClick={() => {
                fetchNutritionFromCSV(prediction.class);
              }}
              style={{
                display:"flex",
                alignItems:"center",
                gap:"8px",
                padding:"10px 16px",
                borderRadius: 10,
                background: "#FFCBAE",
                border: "3px solid #492110",
                cursor:"pointer"
              }}
            >
              <Check size={20} color="#492110" />
              <span style={{ color:"#492110" }}>Find Nutrients</span>
            </button>}
            {hasFetchedNutrients && !loading && <button
              onClick={() => {
                 onAddNutrition(nutrients);
                 onClose();
              }}
              style={{
                display:"flex",
                alignItems:"center",
                gap:"8px",
                padding:"10px 16px",
                borderRadius: 10,
                background: "#FFCBAE",
                border: "3px solid #492110",
                cursor:"pointer"
              }}
            >
              <Check size={20} color="#492110" />
              <span style={{ color:"#492110" }}>Add to Tracker</span>
            </button>}
            <button
              onClick={() => {
                // Reset preview and allow retake or re-upload
                setImagePreview(null);
                setImage(false);
                setVideo(false);
                setCam_up(true);
                // also ensure camera is stopped on retake
                closeCamera(videoRef);
                setPrediction(null);
                setLoading(false);

                setPrediction(null);
                setNutrients({
                  protein: 0,
                  fats: 0,
                  carbs: 0,
                  fibre: 0,
                  calories: 0,
                });
                setHasFetchedNutrients(false);
              }}
              style={{
                display:"flex",
                alignItems:"center",
                gap:"8px",
                padding:"10px 16px",
                borderRadius: 10,
                background: "#FFCBAE",
                border: "3px solid #492110",
                cursor:"pointer"
              }}
            >
              <X size={20} color="#492110" />
              <span style={{ color:"#492110" }}>Retake</span>
            </button>
          </div>
        )}
        {image &&  <input
              type="file"
              ref={imageRef}
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />}
            
        {cam_up && (
          <div style={overall}> 
            {/* Centered camera icon tile */}
            <div style={{
              background: "#FFCBAE",
              border: "5px solid #492110",
              borderRadius: "30px",
              padding: "10px",
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}>
              <Camera
                size={100}
                color="#492110"
                onClick={() => {
                  setVideo(true);
                  openCamera(videoRef);
                  setCam_up(false);
                }}
              />
            </div>
            <div style={{   
              background: "#FFCBAE",
              border: "5px solid #492110",
              borderRadius: "30px",
              padding: "10px",
              cursor:"pointer",
              display:"flex",
              alignItems:"center",
              justifyContent:"center"
            }}>
              <Download size={100} color='#492110' onClick={() => { setImage(true); openImagePicker(imageRef); }}/>
            </div>
          </div>
        )}
    </div>
  );
}

export default Popup;

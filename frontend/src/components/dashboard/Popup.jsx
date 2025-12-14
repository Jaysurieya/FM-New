import { Camera, Download, X, Check } from 'lucide-react';
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



function Popup({onClose, videoRef: externalVideoRef}) {
  const internalVideoRef = useRef(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const imageRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const canvasRef = useRef(null);



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

  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"20px",
    fontFamily: "Alkatra, sans-serif",fontSize:"25px"}}>
        <div style={{display:"flex",flexDirection:"row", alignItems:"center", justifyContent:"space-between", width:"100%"}}>
            <p >Upload Your Food Image</p>
            <X size={30} style={{cursor:"pointer"}} onClick={handleClose}/>
        </div>
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
            <button
              onClick={() => {
                // Proceed with the selected/captured image
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
              <span style={{ color:"#492110" }}>Continue</span>
            </button>
            <button
              onClick={() => {
                // Reset preview and allow retake or re-upload
                setImagePreview(null);
                setImage(false);
                setVideo(false);
                setCam_up(true);
                // also ensure camera is stopped on retake
                closeCamera(videoRef);
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

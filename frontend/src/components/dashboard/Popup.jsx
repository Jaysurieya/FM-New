import { Camera,Download,X} from 'lucide-react';
import {  useRef, useState } from 'react';

const overall={
    display:"flex",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    width:"100%",
    height:"100%",
    gap:"20px",
}

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


function Popup({onClose}) {
    const videoRef = useRef(null);
    const handleClose = () => {
        closeCamera(videoRef);
        onClose();
    };
    const [video,setVideo] = useState(false);
    const [cam_up, setCam_up] = useState(true);
  return (
    <div style={{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",gap:"20px",
    fontFamily: "Alkatra, sans-serif",fontSize:"25px"}}>
        <div style={{display:"flex",flexDirection:"row"}}>
            <p >Upload Your Image</p>
            <X size={30} style={{cursor:"pointer"}} onClick={handleClose}/>
        </div>
        {video &&
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                         width: "450",
                        height: "450px",
                        borderRadius: 10
                    }}
                />
            }
        {cam_up && <div style={overall}> 
            <div style={{
                background: "#FFCBAE",
                border: "5px solid #492110",
                borderRadius: "30px",
                padding: "10px",
                cursor:"pointer"
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
                cursor:"pointer"
            }}>
                <Download size={100} color='#492110'/>
            </div>
        </div>}
    </div>
  );
}

export default Popup;


import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image, Circle } from "lucide-react";
import FilterSelector from "./FilterSelector";

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("normal");
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  
  // Check if device is mobile
  useEffect(() => {
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);
  
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };
  
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };
  
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      // Draw the video frame to the canvas
      ctx.drawImage(video, 0, 0);
      
      // Apply filter effects
      applyFilter(ctx, canvas.width, canvas.height);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          onCapture(blob);
          stopCamera();
        }
      }, "image/jpeg", 0.8);
    }
  };
  
  const applyFilter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    switch(activeFilter) {
      case "grayscale":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;     // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        break;
      case "sepia":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
          data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
          data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
        }
        break;
      case "invert":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];         // red
          data[i + 1] = 255 - data[i + 1]; // green
          data[i + 2] = 255 - data[i + 2]; // blue
        }
        break;
      case "saturate":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const delta = max - min;
          
          if (delta !== 0 && max !== 0) {
            // Increase saturation
            data[i] = r + (r - min) * 0.5;
            data[i + 1] = g + (g - min) * 0.5;
            data[i + 2] = b + (b - min) * 0.5;
          }
        }
        break;
      // normal - no filter applied
    }
    
    ctx.putImageData(imageData, 0, 0);
  };
  
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center">
      <Tabs defaultValue="camera" className="w-full mb-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="camera" onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Image className="mr-2 h-4 w-4" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="camera" className="space-y-4">
          <div className="relative aspect-[3/4] max-w-sm mx-auto bg-black rounded-xl overflow-hidden">
            {isCameraActive ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Button onClick={startCamera}>
                  <Camera className="mr-2 h-4 w-4" />
                  Start Camera
                </Button>
              </div>
            )}
          </div>
          
          {isCameraActive && (
            <div className="space-y-4">
              <FilterSelector activeFilter={activeFilter} onChange={setActiveFilter} />
              
              <div className="flex justify-center space-x-2">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={capturePhoto} className="bg-brand-600 hover:bg-brand-700">
                  <Circle className="mr-2 h-4 w-4" />
                  Capture
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-xl">
            <Image className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="mb-4 text-sm text-muted-foreground text-center">
              Drag and drop your image here or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="image-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onCapture(file);
                }
              }}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              Choose File
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;

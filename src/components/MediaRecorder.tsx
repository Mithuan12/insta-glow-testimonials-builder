import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MediaRecorderProps {
  mediaType: 'audio' | 'video';
  onRecordingComplete: (blob: Blob) => void;
}

const MediaRecorderComponent: React.FC<MediaRecorderProps> = ({ mediaType, onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: mediaType === 'video'
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (mediaType === 'video' && videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = mediaStream;
      }

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaType === 'video' ? 'video/webm' : 'audio/webm'
        });
        onRecordingComplete(blob);
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Error",
        description: "Could not access your camera/microphone. Please ensure you have granted permission.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="space-y-4">
      {mediaType === 'video' && (
        <div className="relative aspect-video w-full bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoPreviewRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            className="flex items-center gap-2"
          >
            {mediaType === 'video' ? (
              <Video className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="flex items-center gap-2"
          >
            {mediaType === 'video' ? (
              <VideoOff className="h-4 w-4" />
            ) : (
              <MicOff className="h-4 w-4" />
            )}
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default MediaRecorderComponent;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Camera, Image } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormDescription } from '@/components/ui/form';
import CameraCapture from './CameraCapture';

interface MediaTypeSelectorProps {
  form: UseFormReturn<any>;
  onFileSelect: (file: File) => void;
}

const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({ form, onFileSelect }) => {
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('text');
  const mediaType = form.getValues("mediaType");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      form.setValue("mediaType", file.type.startsWith('audio/') ? "audio" : "video");
    }
  };
  
  const handleCameraCapture = (blob: Blob) => {
    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
    onFileSelect(file);
    form.setValue("mediaType", "video");
    setIsCameraOpen(false);
  };
  
  if (isCameraOpen) {
    return <CameraCapture 
      onCapture={handleCameraCapture} 
      onCancel={() => setIsCameraOpen(false)} 
    />;
  }
  
  return (
    <div>
      <Tabs 
        defaultValue="text" 
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          if (value === "text") {
            form.setValue("mediaType", "text");
          }
        }}
        className="mb-6"
      >
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="text">
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="camera">
            <Camera className="w-4 h-4 mr-2" />
            Camera
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Image className="w-4 h-4 mr-2" />
            Upload
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Share your experience using text only
          </p>
        </TabsContent>
        
        <TabsContent value="camera" className="space-y-2">
          <div className="flex justify-center">
            <Button 
              onClick={() => setIsCameraOpen(true)}
              className="bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600"
            >
              <Camera className="w-4 h-4 mr-2" />
              Open Snapchat-style Camera
            </Button>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Take a photo with fun filters
          </p>
        </TabsContent>
        
        <TabsContent value="upload" className="space-y-2">
          <div className="flex justify-center">
            <Button 
              variant="outline"
              onClick={() => document.getElementById('media-upload')?.click()}
            >
              <Image className="w-4 h-4 mr-2" />
              Select Media File
            </Button>
            <input
              id="media-upload"
              type="file"
              accept="image/*,video/*,audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Upload an image, video, or audio recording
          </p>
        </TabsContent>
      </Tabs>
      
      <FormDescription className="text-xs text-muted-foreground mb-4">
        <strong>Share your experience:</strong> Select your preferred way to leave a testimonial - with text, a snapshot, or upload media.
      </FormDescription>
    </div>
  );
};

export default MediaTypeSelector;

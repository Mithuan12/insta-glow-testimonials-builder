
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormDescription } from '@/components/ui/form';

interface MediaTypeSelectorProps {
  form: UseFormReturn<any>;
  onFileSelect: (file: File) => void;
}

const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({ form, onFileSelect }) => {
  const mediaType = form.getValues("mediaType");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      form.setValue("mediaType", file.type.startsWith('audio/') ? "audio" : "video");
    }
  };
  
  return (
    <div>
      <div className="flex gap-4 mb-6">
        <Button
          type="button"
          variant={mediaType === "text" ? "default" : "outline"}
          className="flex-1"
          onClick={() => form.setValue("mediaType", "text")}
        >
          <FileText className="w-4 h-4 mr-2" />
          Text
        </Button>
        <Button
          type="button"
          variant={mediaType !== "text" ? "default" : "outline"}
          className="flex-1"
          onClick={() => document.getElementById('media-upload')?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Media
        </Button>
        <input
          id="media-upload"
          type="file"
          accept="audio/*,video/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      <FormDescription className="text-muted-foreground text-sm mb-4">
        <strong>Media Upload Instructions:</strong>
        <ul className="list-disc list-inside mt-2">
          <li>For audio/video testimonials, click "Upload Media"</li>
          <li>Select an audio or video file from your device</li>
          <li>Supported formats: MP3, WAV, MP4, MOV</li>
          <li>Maximum file size: 50MB</li>
        </ul>
      </FormDescription>
    </div>
  );
};

export default MediaTypeSelector;

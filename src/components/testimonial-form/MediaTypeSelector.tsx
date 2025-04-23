
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

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
      form.setValue("mediaType", "audio");
    }
  };
  
  return (
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
        onClick={() => document.getElementById('audio-upload')?.click()}
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Audio
      </Button>
      <input
        id="audio-upload"
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default MediaTypeSelector;

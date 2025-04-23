
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mic } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface MediaTypeSelectorProps {
  form: UseFormReturn<any>;
  onRecord: () => void;
}

const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({ form, onRecord }) => {
  const mediaType = form.getValues("mediaType");
  
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
        onClick={() => {
          onRecord();
          form.setValue("mediaType", "audio");
        }}
      >
        <Mic className="w-4 h-4 mr-2" />
        Record Audio
      </Button>
    </div>
  );
};

export default MediaTypeSelector;

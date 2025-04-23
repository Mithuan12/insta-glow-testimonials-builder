
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mic, Video } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface MediaTypeSelectorProps {
  form: UseFormReturn<any>;
}

const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({ form }) => {
  return (
    <div className="flex gap-4 mb-6">
      <Button
        type="button"
        variant={form.getValues("mediaType") === "text" ? "default" : "outline"}
        className="flex-1"
        onClick={() => form.setValue("mediaType", "text")}
      >
        <FileText className="w-4 h-4 mr-2" />
        Text
      </Button>
      <Button
        type="button"
        variant={form.getValues("mediaType") === "audio" ? "default" : "outline"}
        className="flex-1"
        onClick={() => form.setValue("mediaType", "audio")}
      >
        <Mic className="w-4 h-4 mr-2" />
        Audio
      </Button>
      <Button
        type="button"
        variant={form.getValues("mediaType") === "video" ? "default" : "outline"}
        className="flex-1"
        onClick={() => form.setValue("mediaType", "video")}
      >
        <Video className="w-4 h-4 mr-2" />
        Video
      </Button>
    </div>
  );
};

export default MediaTypeSelector;

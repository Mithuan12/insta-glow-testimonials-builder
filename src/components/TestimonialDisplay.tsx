
import React from 'react';
import { Testimonial } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText, Mic, Video } from 'lucide-react';

interface TestimonialDisplayProps {
  testimonial: Testimonial;
}

const TestimonialDisplay: React.FC<TestimonialDisplayProps> = ({ testimonial }) => {
  const renderMedia = () => {
    if (!testimonial.mediaUrl) return null;

    switch (testimonial.mediaType) {
      case 'audio':
        return (
          <audio controls className="w-full mt-4">
            <source src={testimonial.mediaUrl} type="audio/*" />
            Your browser does not support the audio element.
          </audio>
        );
      case 'video':
        return (
          <video controls className="w-full mt-4 rounded-lg">
            <source src={testimonial.mediaUrl} type="video/*" />
            Your browser does not support the video element.
          </video>
        );
      default:
        return null;
    }
  };

  const renderIcon = () => {
    switch (testimonial.mediaType) {
      case 'audio':
        return <Mic className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        {renderIcon()}
        <h3 className="font-medium">{testimonial.customerName}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300 mb-2">{testimonial.message}</p>
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-lg ${
                star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
        {renderMedia()}
      </CardContent>
    </Card>
  );
};

export default TestimonialDisplay;

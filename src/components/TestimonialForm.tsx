
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import MediaTypeSelector from "./testimonial-form/MediaTypeSelector";
import RatingStars from "./testimonial-form/RatingStars";
import { testimonialFormSchema, type TestimonialFormData } from "./testimonial-form/testimonialFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

type TestimonialFormProps = {
  onSuccess?: () => void;
};

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSuccess }) => {
  const { addTestimonial, loadTestimonials } = useTestimonials();
  const { toast } = useToast();
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialFormSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      message: "",
      rating: 5,
      mediaType: "text",
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please upload a file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setMediaBlob(file);
    toast({
      title: "File Selected",
      description: `${file.type.startsWith('image/') ? 'Image' : 
                    file.type.startsWith('audio/') ? 'Audio' : 'Video'} file has been selected.`,
    });
  };

  const onSubmit = async (values: TestimonialFormData) => {
    try {
      setIsSubmitting(true);
      
      let mediaUrl = undefined;
      
      if (values.mediaType !== 'text' && mediaBlob) {
        const fileExt = mediaBlob.type.split('/')[1] || 'webm';
        const filename = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('testimonial-media')
          .upload(filename, mediaBlob);

        if (error) throw error;
        
        if (data) {
          mediaUrl = data.path;
        }
      }
      
      const testimonialData = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail || undefined,
        message: values.message,
        rating: values.rating,
        mediaType: values.mediaType,
        mediaUrl,
      };
      
      await addTestimonial(testimonialData);
      await loadTestimonials();

      form.reset();
      setMediaBlob(null);
      
      if (onSuccess) onSuccess();
      
      toast({
        title: "Success",
        description: "Your testimonial has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to submit your testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden rounded-xl border-none bg-white/90 backdrop-blur-sm shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
          Share Your Story
        </h2>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <MediaTypeSelector form={form} onFileSelect={handleFileSelect} />

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <RatingStars form={form} />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Testimonial</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with our product or service..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Submitting...
                </div>
              ) : (
                "Submit Testimonial"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;

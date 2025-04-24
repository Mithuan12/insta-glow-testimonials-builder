
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const { addTestimonial } = useTestimonials();
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
      description: `${file.type.startsWith('audio/') ? 'Audio' : 'Video'} file has been selected.`,
    });
  };

  const onSubmit = async (values: TestimonialFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting testimonial form:", values);
      
      let mediaUrl = undefined;
      
      if (values.mediaType !== 'text' && mediaBlob) {
        const fileExt = mediaBlob.type.split('/')[1] || 'webm';
        const filename = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('testimonial-media')
          .upload(filename, mediaBlob);

        if (error) {
          console.error("Storage upload error:", error);
          throw error;
        }
        
        if (data) {
          console.log("File uploaded successfully:", data);
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
      
      console.log("Sending testimonial data to context:", testimonialData);
      
      await addTestimonial(testimonialData);
      
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>
          We appreciate your feedback! Please share your experience with us.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <MediaTypeSelector form={form} onFileSelect={handleFileSelect} />

            {mediaBlob && (
              <FormItem>
                <FormLabel>Selected Media File</FormLabel>
                <FormControl>
                  <div className="p-4 border rounded-md bg-muted">
                    <p className="text-sm text-muted-foreground">
                      File selected: {(mediaBlob as File).name}
                    </p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}

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
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
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

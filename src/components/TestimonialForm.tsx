
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
import { useToast } from "@/components/ui/use-toast";
import MediaRecorder from "./MediaRecorder";
import MediaTypeSelector from "./testimonial-form/MediaTypeSelector";
import RatingStars from "./testimonial-form/RatingStars";
import { testimonialFormSchema, type TestimonialFormData } from "./testimonial-form/testimonialFormSchema";
import { supabase } from "@/integrations/supabase/client";

type TestimonialFormProps = {
  onSuccess?: () => void;
};

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSuccess }) => {
  const { addTestimonial } = useTestimonials();
  const { toast } = useToast();
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  
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

  const handleRecordingComplete = (blob: Blob) => {
    setMediaBlob(blob);
    toast({
      title: "Recording completed",
      description: "Your recording has been saved successfully.",
    });
  };

  const onSubmit = async (values: TestimonialFormData) => {
    try {
      let mediaUrl = undefined;
      
      if (values.mediaType !== 'text' && mediaBlob) {
        const fileExt = 'webm';
        const filename = `${Math.random()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('testimonial-media')
          .upload(filename, mediaBlob);

        if (error) throw error;
        mediaUrl = data.path;
      }
      
      await addTestimonial({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail,
        message: values.message,
        rating: values.rating,
        mediaType: values.mediaType,
        mediaUrl,
      });

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
            <MediaTypeSelector form={form} />

            {form.getValues("mediaType") !== "text" && (
              <FormItem>
                <FormLabel>Record {form.getValues("mediaType")}</FormLabel>
                <FormControl>
                  <MediaRecorder
                    mediaType={form.getValues("mediaType") as 'audio' | 'video'}
                    onRecordingComplete={handleRecordingComplete}
                  />
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
            <Button type="submit" className="w-full">
              Submit Testimonial
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TestimonialForm;

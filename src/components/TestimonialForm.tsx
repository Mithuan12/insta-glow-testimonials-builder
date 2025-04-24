
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTestimonials } from "@/context/TestimonialContext";
import { testimonialFormSchema, type TestimonialFormData } from "./testimonial-form/testimonialFormSchema";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import FormFields from "./testimonial-form/FormFields";

const TestimonialForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
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

  const handleFormSubmit = async (values: TestimonialFormData) => {
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
      
      await addTestimonial({
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail || undefined,
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
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormFields 
              form={form}
              mediaBlob={mediaBlob}
              setMediaBlob={setMediaBlob}
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

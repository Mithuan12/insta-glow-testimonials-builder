import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { NewTestimonial } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { Video, Mic, FileText } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  customerPhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  customerEmail: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  message: z.string().min(5, {
    message: "Testimonial must be at least 5 characters.",
  }),
  rating: z.number().min(1).max(5),
  mediaType: z.enum(["text", "audio", "video"]),
});

type TestimonialFormValues = z.infer<typeof formSchema>;

type TestimonialFormProps = {
  onSuccess?: () => void;
};

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSuccess }) => {
  const { addTestimonial } = useTestimonials();
  const { toast } = useToast();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  
  const form = useForm<TestimonialFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      message: "",
      rating: 5,
      mediaType: "text",
    },
  });

  const uploadMedia = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const filename = `${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('testimonial-media')
      .upload(filename, file);

    if (error) throw error;
    return data.path;
  };

  const onSubmit = async (values: TestimonialFormValues) => {
    try {
      let mediaUrl = undefined;
      
      if (mediaFile && values.mediaType !== 'text') {
        mediaUrl = await uploadMedia(mediaFile);
      }
      
      const testimonialData: NewTestimonial = {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail || undefined,
        message: values.message,
        rating: values.rating,
        mediaType: values.mediaType,
        mediaUrl,
      };
      
      await addTestimonial(testimonialData);
      form.reset();
      setMediaFile(null);
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
  
  const renderStars = () => {
    const rating = form.watch("rating");
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => form.setValue("rating", star)}
            className={`text-2xl ${star <= rating ? "text-amber-400" : "text-gray-300"}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
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

            {form.getValues("mediaType") !== "text" && (
              <FormItem>
                <FormLabel>Upload {form.getValues("mediaType")}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept={form.getValues("mediaType") === "audio" ? "audio/*" : "video/*"}
                    onChange={handleFileChange}
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

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  {renderStars()}
                  <FormMessage />
                </FormItem>
              )}
            />
            
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

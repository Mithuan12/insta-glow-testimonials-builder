
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { TestimonialFormData } from "./testimonialFormSchema";
import MediaTypeSelector from "./MediaTypeSelector";
import RatingStars from "./RatingStars";

interface FormFieldsProps {
  form: UseFormReturn<TestimonialFormData>;
  mediaBlob: Blob | null;
  setMediaBlob: (blob: Blob | null) => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ form, mediaBlob, setMediaBlob }) => {
  const handleFileSelect = (file: File) => {
    setMediaBlob(file);
  };

  return (
    <>
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
    </>
  );
};

export default FormFields;

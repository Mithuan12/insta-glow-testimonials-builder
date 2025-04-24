
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  customerPhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

const SMSForm = () => {
  const { addSMSNotification, loadNotifications } = useTestimonials();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
    },
  });

  const formatPhoneNumber = (phone: string): string => {
    // If number already has a + prefix, just clean non-numeric chars after it
    if (phone.startsWith('+')) {
      const cleaned = phone.substring(1).replace(/\D/g, '');
      return `+${cleaned}`;
    }
    
    // Clean any non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Return with + prefix
    return `+${cleaned}`;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formattedPhone = formatPhoneNumber(values.customerPhone);
      
      console.log("Preparing WhatsApp message for:", {
        name: values.customerName,
        phone: formattedPhone
      });
      
      const notificationData = {
        customerName: values.customerName,
        customerPhone: formattedPhone,
      };

      // Add notification to track the request
      await addSMSNotification(notificationData);
      await loadNotifications();
      
      // Generate WhatsApp message
      const formUrl = `${window.location.origin}/form/${Date.now().toString(36)}`;
      const message = `Hello ${values.customerName}! Thank you for choosing our services. Please share your testimonial using this link: ${formUrl}`;
      const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodeURIComponent(message)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');
      
      form.reset();
      
      toast({
        title: "Success",
        description: "WhatsApp message prepared with testimonial form link",
      });
    } catch (error) {
      console.error("Error preparing WhatsApp message:", error);
      toast({
        title: "Error",
        description: "Failed to prepare WhatsApp message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send Testimonial Form</CardTitle>
        <CardDescription>
          Send the testimonial form link via WhatsApp to your customer.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
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
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter WhatsApp number with country code (e.g. +1234567890)" {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Format: Include country code (e.g., +1 for US)
                  </p>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send via WhatsApp
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        Message will include a link to your custom testimonial form
      </CardFooter>
    </Card>
  );
};

export default SMSForm;

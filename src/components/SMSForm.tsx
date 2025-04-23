
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
import { useToast } from "@/components/ui/use-toast";
import { Send, Loader2 } from "lucide-react";

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
    // Strip any non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Ensure it starts with country code if missing
    if (!cleaned.startsWith('1') && cleaned.length === 10) {
      return `1${cleaned}`;
    }
    
    return cleaned;
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const formattedPhone = formatPhoneNumber(values.customerPhone);
      
      console.log("Sending SMS to:", {
        name: values.customerName,
        phone: formattedPhone
      });
      
      await addSMSNotification({
        customerName: values.customerName,
        customerPhone: formattedPhone,
      });
      
      // After adding a notification, reload the notifications list
      await loadNotifications();
      
      form.reset();
      
      toast({
        title: "Success",
        description: `SMS sent to ${values.customerName} at ${formattedPhone}`,
      });
    } catch (error) {
      console.error("Error sending SMS notification:", error);
      toast({
        title: "Error",
        description: "Failed to send SMS notification. Please try again.",
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
          Send an SMS with a link to your testimonial form.
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1234567890" {...field} />
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
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Form Link
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        SMS will contain a link to your custom testimonial form
      </CardFooter>
    </Card>
  );
};

export default SMSForm;

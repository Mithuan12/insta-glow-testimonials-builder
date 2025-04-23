
import React, { createContext, useState, useContext, useEffect } from "react";
import { Testimonial, Template, SMSNotification } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TestimonialContextType {
  testimonials: Testimonial[];
  templates: Template[];
  notifications: SMSNotification[];
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => Promise<void>;
  addSMSNotification: (notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => Promise<void>;
  updateTestimonial: (id: string, update: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

// This is a temporary implementation until we connect to a backend
export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Predefined templates
  const [templates] = useState<Template[]>([
    {
      id: "template-1",
      name: "Simple Gradient",
      thumbnail: "/templates/simple-gradient-thumb.jpg",
      background: "bg-gradient-to-br from-gradient-start to-gradient-end",
      textPosition: "center",
      textAlignment: "center",
      textColor: "text-white",
      font: "font-sans"
    },
    {
      id: "template-2",
      name: "Clean White",
      thumbnail: "/templates/clean-white-thumb.jpg",
      background: "bg-white",
      textPosition: "center",
      textAlignment: "center",
      textColor: "text-gray-900",
      font: "font-serif"
    },
    {
      id: "template-3",
      name: "Dark Minimal",
      thumbnail: "/templates/dark-minimal-thumb.jpg",
      background: "bg-gray-900",
      textPosition: "bottom",
      textAlignment: "left",
      textColor: "text-white",
      font: "font-mono"
    },
  ]);

  // Load data from localStorage on first render
  useEffect(() => {
    const loadData = () => {
      try {
        const storedTestimonials = localStorage.getItem("testimonials");
        if (storedTestimonials) {
          setTestimonials(JSON.parse(storedTestimonials));
        }
        
        const storedNotifications = localStorage.getItem("smsNotifications");
        if (storedNotifications) {
          setNotifications(JSON.parse(storedNotifications));
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (testimonials.length > 0) {
      localStorage.setItem("testimonials", JSON.stringify(testimonials));
    }
  }, [testimonials]);
  
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem("smsNotifications", JSON.stringify(notifications));
    }
  }, [notifications]);

  const addTestimonial = async (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => {
    try {
      console.log("Adding testimonial:", testimonial); // Debug log
      
      // In a real app, this would be an API call
      const newTestimonial: Testimonial = {
        ...testimonial,
        id: `testimonial-${Date.now()}`,
        createdAt: new Date().toISOString(),
        published: false,
      };
      
      setTestimonials(prev => [...prev, newTestimonial]);
      
      toast({
        title: "Success!",
        description: "Testimonial has been submitted successfully.",
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error("Error adding testimonial:", err);
      toast({
        title: "Error",
        description: "Failed to submit testimonial",
        variant: "destructive",
      });
      return Promise.reject(err);
    }
  };
  
  const addSMSNotification = async (notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => {
    try {
      // Generate unique, shareable form URL
      const formId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const formUrl = `${window.location.origin}/form/${formId}`;
      
      // Simulate SMS sending - in a real app, we would call a Twilio API or similar here
      console.log(`Sending SMS to ${notification.customerPhone} with form URL: ${formUrl}`);
      
      // Create the new notification
      const newNotification: SMSNotification = {
        ...notification,
        id: `sms-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'sent', // In real implementation, this would be 'pending' initially
        formUrl,
      };
      
      // Update state with the new notification
      setNotifications(prevNotifications => [...prevNotifications, newNotification]);
      
      // Show success toast
      toast({
        title: "SMS Notification Sent",
        description: `SMS notification to ${notification.customerName} has been sent.`,
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error("Error sending SMS notification:", err);
      toast({
        title: "Error",
        description: "Failed to send SMS notification",
        variant: "destructive",
      });
      return Promise.reject(err);
    }
  };

  const updateTestimonial = async (id: string, update: Partial<Testimonial>) => {
    try {
      // In a real app, this would be an API call
      setTestimonials(testimonials.map(t => 
        t.id === id ? { ...t, ...update } : t
      ));
      toast({
        title: "Success!",
        description: "Testimonial has been updated successfully.",
      });
      return Promise.resolve();
    } catch (err) {
      console.error("Error updating testimonial:", err);
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      });
      return Promise.reject(err);
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      // In a real app, this would be an API call
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast({
        title: "Success!",
        description: "Testimonial has been deleted successfully.",
      });
      return Promise.resolve();
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
      return Promise.reject(err);
    }
  };

  return (
    <TestimonialContext.Provider
      value={{
        testimonials,
        templates,
        notifications,
        addTestimonial,
        addSMSNotification,
        updateTestimonial,
        deleteTestimonial,
        loading,
        error,
      }}
    >
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (context === undefined) {
    throw new Error("useTestimonials must be used within a TestimonialProvider");
  }
  return context;
};

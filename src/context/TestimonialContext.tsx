
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
  loadTestimonials: () => Promise<void>;
  loadNotifications: () => Promise<void>;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

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

  // Function to load testimonials from localStorage
  const loadTestimonials = async () => {
    try {
      console.log("Loading testimonials from storage");
      const storedTestimonials = localStorage.getItem("testimonials");
      if (storedTestimonials) {
        const parsedTestimonials = JSON.parse(storedTestimonials);
        console.log("Parsed testimonials:", parsedTestimonials);
        setTestimonials(parsedTestimonials);
      } else {
        console.log("No stored testimonials found");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("Error loading testimonials:", err);
      setError("Failed to load testimonials");
      return Promise.reject(err);
    }
  };

  // Function to load notifications from localStorage
  const loadNotifications = async () => {
    try {
      console.log("Loading SMS notifications from storage");
      const storedNotifications = localStorage.getItem("smsNotifications");
      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications);
        console.log("Parsed notifications:", parsedNotifications);
        setNotifications(parsedNotifications);
      } else {
        console.log("No stored SMS notifications found");
        setNotifications([]);
      }
      return Promise.resolve();
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
      return Promise.reject(err);
    }
  };

  // Load data from localStorage on first render
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await loadTestimonials();
        await loadNotifications();
      } catch (err) {
        console.error("Error in loadData:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save testimonials to localStorage whenever they change
  useEffect(() => {
    if (testimonials.length > 0) {
      console.log("Saving testimonials to storage:", testimonials);
      localStorage.setItem("testimonials", JSON.stringify(testimonials));
    }
  }, [testimonials]);
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    console.log("Saving notifications to storage:", notifications);
    localStorage.setItem("smsNotifications", JSON.stringify(notifications));
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
      
      // Update state with the new testimonial
      setTestimonials(prev => {
        const updated = [...prev, newTestimonial];
        console.log("Updated testimonials:", updated);
        return updated;
      });
      
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
      // Log the input
      console.log("Adding SMS notification with data:", notification);
      
      // Validate phone number
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      let phoneNumber = notification.customerPhone;
      
      if (!phoneRegex.test(phoneNumber)) {
        console.error("Invalid phone format:", phoneNumber);
        throw new Error(`Invalid phone number format: ${phoneNumber}`);
      }
      
      // Generate unique, shareable form URL
      const formId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const formUrl = `${window.location.origin}/form/${formId}`;
      
      // Simulate SMS sending - in a real app, we would call a Twilio API or similar here
      console.log(`Sending SMS to ${phoneNumber} with form URL: ${formUrl}`);
      
      // Create the new notification
      const newNotification: SMSNotification = {
        ...notification,
        id: `sms-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'sent', // In real implementation, this would be 'pending' initially
        formUrl,
      };
      
      console.log("Created new notification:", newNotification);
      
      // Update state with the new notification
      setNotifications(prevNotifications => {
        const updated = [...prevNotifications, newNotification];
        console.log("Updated notifications:", updated);
        return updated;
      });
      
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
        description: `Failed to send SMS notification: ${err instanceof Error ? err.message : 'Unknown error'}`,
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
        loadTestimonials,
        loadNotifications,
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

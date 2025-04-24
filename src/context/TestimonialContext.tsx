
import React, { createContext, useState, useContext, useEffect } from "react";
import { Testimonial, SMSNotification } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { TestimonialContextType } from "./testimonials/types";
import { defaultTemplates } from "./testimonials/templateData";
import {
  loadTestimonialsFromStorage,
  saveTestimonialsToStorage,
  loadNotificationsFromStorage,
  saveNotificationsToStorage,
} from "./testimonials/storage";

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const loadedTestimonials = loadTestimonialsFromStorage();
      setTestimonials(loadedTestimonials);
      return Promise.resolve();
    } catch (err) {
      console.error("Error loading testimonials:", err);
      setError("Failed to load testimonials");
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const loadedNotifications = loadNotificationsFromStorage();
      setNotifications(loadedNotifications);
      return Promise.resolve();
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
      return Promise.reject(err);
    }
  };

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

  useEffect(() => {
    saveTestimonialsToStorage(testimonials);
  }, [testimonials]);
  
  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);

  const addTestimonial = async (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => {
    try {
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
      const formId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const formUrl = `${window.location.origin}/form/${formId}`;
      
      const newNotification: SMSNotification = {
        ...notification,
        id: `sms-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'sent',
        formUrl,
      };
      
      setNotifications(prev => [...prev, newNotification]);
      
      toast({
        title: "Success",
        description: `WhatsApp notification to ${notification.customerName} has been prepared.`,
      });
      
      return Promise.resolve();
    } catch (err) {
      console.error("Error creating notification:", err);
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      });
      return Promise.reject(err);
    }
  };

  const updateTestimonial = async (id: string, update: Partial<Testimonial>) => {
    try {
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
        templates: defaultTemplates,
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

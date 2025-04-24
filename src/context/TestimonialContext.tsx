
import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { Testimonial, SMSNotification } from "@/types";
import { TestimonialContextType } from "./testimonials/types";
import { defaultTemplates } from "./testimonials/templateData";
import { 
  loadTestimonialsFromStorage, 
  saveTestimonialsToStorage, 
  loadNotificationsFromStorage, 
  saveNotificationsToStorage
} from "./testimonials/storage";
import { useTestimonialActions } from "./testimonials/hooks";

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize testimonials and notifications on mount
  useEffect(() => {
    console.log("TestimonialProvider mounted: Loading data");
    loadTestimonials();
    loadNotifications();
  }, []);

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const loadedTestimonials = loadTestimonialsFromStorage();
      console.log("Loaded testimonials:", loadedTestimonials);
      setTestimonials(loadedTestimonials);
    } catch (err) {
      console.error("Error loading testimonials:", err);
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setNotifications(loadNotificationsFromStorage());
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
    }
  }, []);

  const addTestimonial = useCallback(async (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: `testimonial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      published: false,
    };
    
    // First load latest testimonials to avoid overwriting
    const currentTestimonials = loadTestimonialsFromStorage();
    
    // Then add the new testimonial
    const updatedTestimonials = [...currentTestimonials, newTestimonial];
    
    // Save to storage
    saveTestimonialsToStorage(updatedTestimonials);
    
    // Update state
    setTestimonials(updatedTestimonials);
    
    console.log("Testimonial added:", newTestimonial);
    console.log("Updated testimonials:", updatedTestimonials);
  }, []);

  const addSMSNotification = useCallback(async (notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => {
    const formId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const formUrl = `${window.location.origin}/form/${formId}`;
    
    const newNotification: SMSNotification = {
      ...notification,
      id: `sms-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'sent',
      formUrl,
    };
    
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      saveNotificationsToStorage(updated);
      return updated;
    });
  }, []);

  const updateTestimonial = useCallback(async (id: string, update: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...update } : t);
      saveTestimonialsToStorage(updated);
      return updated;
    });
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTestimonialsToStorage(updated);
      return updated;
    });
  }, []);

  const contextValue: TestimonialContextType = {
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
  };

  return (
    <TestimonialContext.Provider value={contextValue}>
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error("useTestimonials must be used within TestimonialProvider");
  return context;
};

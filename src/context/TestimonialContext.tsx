
import React, { createContext, useState, useContext, useCallback } from "react";
import { Testimonial, SMSNotification } from "@/types";
import { TestimonialContextType } from "./testimonials/types";
import { defaultTemplates } from "./testimonials/templateData";
import { loadTestimonialsFromStorage, loadNotificationsFromStorage } from "./testimonials/storage";
import { useTestimonialActions } from "./testimonials/hooks";

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addTestimonial, addSMSNotification } = useTestimonialActions(setTestimonials, setNotifications);

  const loadTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      setTestimonials(loadTestimonialsFromStorage());
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

  const updateTestimonial = useCallback(async (id: string, update: Partial<Testimonial>) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, ...update } : t));
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  }, []);

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
  if (!context) throw new Error("useTestimonials must be used within TestimonialProvider");
  return context;
};

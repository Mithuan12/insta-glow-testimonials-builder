
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
  
  const { addTestimonial, addSMSNotification } = useTestimonialActions(setTestimonials, setNotifications);

  useEffect(() => {
    const initializeData = async () => {
      const storedTestimonials = await loadTestimonialsFromStorage();
      setTestimonials(Array.isArray(storedTestimonials) ? storedTestimonials : []);
      setNotifications(loadNotificationsFromStorage());
    };
    initializeData();
  }, []);

  const loadTestimonials = useCallback(async () => {
    const storedTestimonials = await loadTestimonialsFromStorage();
    setTestimonials(storedTestimonials);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const storedNotifications = loadNotificationsFromStorage();
      setNotifications(storedNotifications);
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
    }
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

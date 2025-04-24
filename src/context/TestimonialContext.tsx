
/**
 * TestimonialContext.tsx
 * This file manages the global state for testimonials and notifications using React Context.
 * It provides functions to add, update, and delete testimonials, as well as manage notifications.
 */

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

// Create context with undefined initial value
const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  // State management using hooks
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addTestimonial, addSMSNotification } = useTestimonialActions(setTestimonials, setNotifications);

  // Load initial data when component mounts
  useEffect(() => {
    const initData = async () => {
      const stored = await loadTestimonialsFromStorage();
      setTestimonials(Array.isArray(stored) ? stored : []);
      setNotifications(loadNotificationsFromStorage());
    };
    initData();
  }, []);

  // CRUD operations for testimonials
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

  // Context value object with all required functions and state
  const contextValue = {
    testimonials,
    templates: defaultTemplates,
    notifications,
    addTestimonial,
    addSMSNotification,
    updateTestimonial,
    deleteTestimonial,
    loading,
    error,
    loadTestimonials: useCallback(async () => {
      const stored = await loadTestimonialsFromStorage();
      setTestimonials(stored);
    }, []),
    loadNotifications: useCallback(async () => {
      setNotifications(loadNotificationsFromStorage());
    }, [])
  };

  return (
    <TestimonialContext.Provider value={contextValue}>
      {children}
    </TestimonialContext.Provider>
  );
};

// Custom hook for using testimonial context
export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error("useTestimonials must be used within TestimonialProvider");
  return context;
};

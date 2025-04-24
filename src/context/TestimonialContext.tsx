import React, { createContext, useContext, useState, useCallback } from "react";
import { TestimonialContextType } from "./testimonials/types";
import { defaultTemplates } from "./testimonials/templateData";
import { loadTestimonialsFromStorage, loadNotificationsFromStorage } from "./testimonials/storage";
import { useTestimonialActions } from "./testimonials/hooks";

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState(() => loadTestimonialsFromStorage());
  const [notifications, setNotifications] = useState(() => loadNotificationsFromStorage());
  const { addTestimonial, addSMSNotification } = useTestimonialActions(setTestimonials, setNotifications);

  const updateTestimonial = useCallback((id: string, update: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...update } : t);
      localStorage.setItem("testimonials", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteTestimonial = useCallback((id: string) => {
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem("testimonials", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <TestimonialContext.Provider value={{
      testimonials,
      templates: defaultTemplates,
      notifications,
      addTestimonial,
      addSMSNotification,
      updateTestimonial,
      deleteTestimonial
    }}>
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error("useTestimonials must be used within TestimonialProvider");
  return context;
};
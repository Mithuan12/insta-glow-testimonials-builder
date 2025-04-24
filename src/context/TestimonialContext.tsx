
import React, { createContext, useContext, useState } from "react";
import { TestimonialContextType } from "./testimonials/types";
import { loadTestimonialsFromStorage, saveTestimonialsToStorage, loadNotificationsFromStorage, saveNotificationsToStorage } from "./testimonials/storage";

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) {
    throw new Error("useTestimonials must be used within TestimonialProvider");
  }
  return context;
};

export const TestimonialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState(() => loadTestimonialsFromStorage());
  const [notifications, setNotifications] = useState(() => loadNotificationsFromStorage());

  const addTestimonial = (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => {
    const newTestimonial = {
      ...testimonial,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      published: false,
    };
    
    setTestimonials(prev => {
      const updated = [...prev, newTestimonial];
      saveTestimonialsToStorage(updated);
      return updated;
    });
  };

  const updateTestimonial = (id: string, update: Partial<Testimonial>) => {
    setTestimonials(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...update } : t);
      saveTestimonialsToStorage(updated);
      return updated;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTestimonialsToStorage(updated);
      return updated;
    });
  };

  const addSMSNotification = (notification: Omit<SMSNotification, "id" | "createdAt" | "status">) => {
    const newNotification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    setNotifications(prev => {
      const updated = [...prev, newNotification];
      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  const value = {
    testimonials,
    notifications,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addSMSNotification,
  };

  return (
    <TestimonialContext.Provider value={value}>
      {children}
    </TestimonialContext.Provider>
  );
};

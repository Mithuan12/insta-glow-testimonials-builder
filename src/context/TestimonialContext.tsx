import React, { createContext, useContext, useState, useEffect } from "react";
import { Testimonial, SMSNotification } from "@/types";
import { loadTestimonialsFromStorage, saveTestimonialsToStorage, loadNotificationsFromStorage, saveNotificationsToStorage } from "./testimonials/storage";

interface TestimonialContextType {
  testimonials: Testimonial[];
  notifications: SMSNotification[];
  addTestimonial: (testimonial: Testimonial) => void;
  removeTestimonial: (id: string) => void;
  addNotification: (notification: SMSNotification) => void;
  removeNotification: (id: string) => void;
}

const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);

  useEffect(() => {
    const loadedTestimonials = loadTestimonialsFromStorage();
    const loadedNotifications = loadNotificationsFromStorage();
    setTestimonials(loadedTestimonials);
    setNotifications(loadedNotifications);
  }, []);

  useEffect(() => {
    saveTestimonialsToStorage(testimonials);
  }, [testimonials]);

  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);

  const addTestimonial = (testimonial: Testimonial) => {
    setTestimonials(prev => [...prev, testimonial]);
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  const addNotification = (notification: SMSNotification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <TestimonialContext.Provider value={{
      testimonials,
      notifications,
      addTestimonial,
      removeTestimonial,
      addNotification,
      removeNotification
    }}>
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) {
    throw new Error("useTestimonials must be used within a TestimonialProvider");
  }
  return context;
};
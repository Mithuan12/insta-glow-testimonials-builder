
import React, { createContext, useContext, useState } from "react";
import { TestimonialContextType, Testimonial, SMSNotification } from "./testimonials/types";
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
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);

  const addTestimonial = (testimonial: Testimonial) => {
    const updatedTestimonials = [...testimonials, testimonial];
    setTestimonials(updatedTestimonials);
    saveTestimonialsToStorage(updatedTestimonials);
  };

  const updateTestimonial = (id: string, updatedTestimonial: Testimonial) => {
    const updatedTestimonials = testimonials.map(t => 
      t.id === id ? updatedTestimonial : t
    );
    setTestimonials(updatedTestimonials);
    saveTestimonialsToStorage(updatedTestimonials);
  };

  const deleteTestimonial = (id: string) => {
    const updatedTestimonials = testimonials.filter(t => t.id !== id);
    setTestimonials(updatedTestimonials);
    saveTestimonialsToStorage(updatedTestimonials);
  };

  const addSMSNotification = (notification: SMSNotification) => {
    const updatedNotifications = [...notifications, notification];
    setNotifications(updatedNotifications);
    saveNotificationsToStorage(updatedNotifications);
  };

  const loadTestimonials = () => {
    const loaded = loadTestimonialsFromStorage();
    setTestimonials(loaded);
  };

  const loadNotifications = () => {
    const loaded = loadNotificationsFromStorage();
    setNotifications(loaded);
  };

  const value = {
    testimonials,
    notifications,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addSMSNotification,
    loadTestimonials,
    loadNotifications
  };

  return (
    <TestimonialContext.Provider value={value}>
      {children}
    </TestimonialContext.Provider>
  );
};

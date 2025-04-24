
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Testimonial, SMSNotification } from "@/types";
import { saveTestimonialsToStorage, saveNotificationsToStorage } from "./storage";

export const useTestimonialActions = (
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>,
  setNotifications: React.Dispatch<React.SetStateAction<SMSNotification[]>>
) => {
  const addTestimonial = async (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => {
    console.log("Adding new testimonial:", testimonial);
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      published: false,
    };
    
    setTestimonials(prev => {
      const updated = [...prev, newTestimonial];
      saveTestimonialsToStorage(updated);
      return updated;
    });
  };

  const addSMSNotification = async (notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => {
    const newNotification: SMSNotification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      formUrl: `${window.location.origin}/form/${uuidv4()}`,
      status: "sent",
    };
    
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      saveNotificationsToStorage(updated);
      return updated;
    });
  };

  return {
    addTestimonial,
    addSMSNotification,
  };
};

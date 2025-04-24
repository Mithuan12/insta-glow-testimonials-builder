
import { v4 as uuidv4 } from "uuid";
import { Testimonial, SMSNotification } from "@/types";
import { saveTestimonialToStorage, saveNotificationsToStorage } from "./storage";

export const useTestimonialActions = (
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>,
  setNotifications: React.Dispatch<React.SetStateAction<SMSNotification[]>>
) => {
  const addTestimonial = async (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => {
    try {
      const newTestimonial: Testimonial = {
        ...testimonial,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        published: false,
      };
      
      // Save to Supabase first
      await saveTestimonialToStorage(newTestimonial);
      
      // Update local state after successful save
      setTestimonials(prev => [...prev, newTestimonial]);
      
      return newTestimonial;
    } catch (error) {
      console.error("Failed to add testimonial:", error);
      throw error;
    }
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

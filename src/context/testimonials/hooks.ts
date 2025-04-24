
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Testimonial, SMSNotification } from "@/types";
import { saveTestimonialsToStorage, saveNotificationsToStorage, loadTestimonialsFromStorage } from "./storage";

export const useTestimonialActions = (
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>,
  setNotifications: React.Dispatch<React.SetStateAction<SMSNotification[]>>,
) => {
  const { toast } = useToast();

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
    
    toast({ title: "Success!", description: "Testimonial submitted successfully." });
  }, [setTestimonials, toast]);

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
    
    toast({ title: "Success", description: `WhatsApp notification prepared.` });
  }, [setNotifications, toast]);

  return { addTestimonial, addSMSNotification };
};

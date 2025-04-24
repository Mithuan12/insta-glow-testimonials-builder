
import { v4 as uuidv4 } from "uuid";
import { Testimonial, SMSNotification } from "@/types";

export const useTestimonialActions = (
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>,
  setNotifications: React.Dispatch<React.SetStateAction<SMSNotification[]>>
) => ({
  addTestimonial: async (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => {
    const newTestimonial = {
      ...testimonial,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      published: false
    };
    
    setTestimonials(prev => {
      const updated = [...prev, newTestimonial];
      localStorage.setItem("testimonials", JSON.stringify(updated));
      return updated;
    });
  },

  addSMSNotification: async (notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => {
    const newNotification = {
      ...notification,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      formUrl: `${window.location.origin}/form/${uuidv4()}`,
      status: "sent"
    };
    
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      localStorage.setItem("smsNotifications", JSON.stringify(updated));
      return updated;
    });
  }
});

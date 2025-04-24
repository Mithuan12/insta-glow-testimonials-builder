
import { Testimonial, Template, SMSNotification } from "@/types";

export interface TestimonialContextType {
  testimonials: Testimonial[];
  templates: Template[];
  notifications: SMSNotification[];
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => void;
  addSMSNotification: (notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => void;
  updateTestimonial: (id: string, update: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;
  loading: boolean;
  error: string | null;
  loadTestimonials: () => void;
  loadNotifications: () => void;
}

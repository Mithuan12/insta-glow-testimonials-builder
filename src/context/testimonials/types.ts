
import { Testimonial, Template, SMSNotification } from "@/types";

export interface TestimonialContextType {
  testimonials: Testimonial[];
  templates: Template[];
  notifications: SMSNotification[];
  addTestimonial: (testimonial: Omit<Testimonial, "id" | "createdAt" | "published">) => Promise<void>;
  addSMSNotification: (notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => Promise<void>;
  updateTestimonial: (id: string, update: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  loadTestimonials: () => Promise<void>;
  loadNotifications: () => Promise<void>;
}

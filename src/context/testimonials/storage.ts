import { Testimonial, SMSNotification } from "@/types";

export const loadTestimonialsFromStorage = (): Testimonial[] => {
  const stored = localStorage.getItem("testimonials");
  return stored ? JSON.parse(stored) : [];
};

export const saveTestimonialsToStorage = (testimonials: Testimonial[]) => {
  localStorage.setItem("testimonials", JSON.stringify(testimonials));
};

export const loadNotificationsFromStorage = (): SMSNotification[] => {
  const stored = localStorage.getItem("notifications");
  return stored ? JSON.parse(stored) : [];
};

export const saveNotificationsToStorage = (notifications: SMSNotification[]) => {
  localStorage.setItem("notifications", JSON.stringify(notifications));
};
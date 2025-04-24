
import { Testimonial, SMSNotification } from "@/types";

export const loadTestimonialsFromStorage = (): Testimonial[] => {
  try {
    const stored = localStorage.getItem("testimonials");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Error loading testimonials:", err);
    return [];
  }
};

export const saveTestimonialsToStorage = (testimonials: Testimonial[]): void => {
  try {
    localStorage.setItem("testimonials", JSON.stringify(testimonials));
  } catch (err) {
    console.error("Error saving testimonials:", err);
  }
};

export const loadNotificationsFromStorage = (): SMSNotification[] => {
  try {
    const stored = localStorage.getItem("smsNotifications");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Error loading notifications:", err);
    return [];
  }
};

export const saveNotificationsToStorage = (notifications: SMSNotification[]): void => {
  try {
    localStorage.setItem("smsNotifications", JSON.stringify(notifications));
  } catch (err) {
    console.error("Error saving notifications:", err);
  }
};

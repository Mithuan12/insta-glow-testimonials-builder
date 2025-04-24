
import { Testimonial, SMSNotification } from "@/types";

export const loadTestimonialsFromStorage = (): Testimonial[] => {
  try {
    const stored = localStorage.getItem("testimonials");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error("Error loading testimonials from storage:", err);
  }
  return [];
};

export const saveTestimonialsToStorage = (testimonials: Testimonial[]): void => {
  try {
    localStorage.setItem("testimonials", JSON.stringify(testimonials));
  } catch (err) {
    console.error("Error saving testimonials to storage:", err);
  }
};

export const loadNotificationsFromStorage = (): SMSNotification[] => {
  try {
    const stored = localStorage.getItem("smsNotifications");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.error("Error loading notifications from storage:", err);
  }
  return [];
};

export const saveNotificationsToStorage = (notifications: SMSNotification[]): void => {
  try {
    localStorage.setItem("smsNotifications", JSON.stringify(notifications));
  } catch (err) {
    console.error("Error saving notifications to storage:", err);
  }
};

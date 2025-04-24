import { Testimonial, SMSNotification } from "@/types";

export const loadTestimonialsFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("testimonials") || "[]");
  } catch {
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

export const loadNotificationsFromStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("smsNotifications") || "[]");
  } catch {
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
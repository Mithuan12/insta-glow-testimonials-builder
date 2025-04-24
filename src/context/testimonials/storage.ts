
import { Testimonial, SMSNotification } from "@/types";

const TESTIMONIALS_STORAGE_KEY = "testimonials";
const SMS_NOTIFICATIONS_STORAGE_KEY = "smsNotifications";

export const loadTestimonialsFromStorage = (): Testimonial[] => {
  try {
    const stored = localStorage.getItem(TESTIMONIALS_STORAGE_KEY);
    const data = stored ? JSON.parse(stored) : [];
    console.log("Loading testimonials from storage:", data);
    return data;
  } catch (err) {
    console.error("Error loading testimonials from storage:", err);
    return [];
  }
};

export const saveTestimonialsToStorage = (testimonials: Testimonial[]): void => {
  try {
    localStorage.setItem(TESTIMONIALS_STORAGE_KEY, JSON.stringify(testimonials));
    console.log("Saved testimonials to storage. Count:", testimonials.length);
  } catch (err) {
    console.error("Error saving testimonials to storage:", err);
  }
};

export const loadNotificationsFromStorage = (): SMSNotification[] => {
  try {
    const stored = localStorage.getItem(SMS_NOTIFICATIONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Error loading notifications from storage:", err);
    return [];
  }
};

export const saveNotificationsToStorage = (notifications: SMSNotification[]): void => {
  try {
    localStorage.setItem(SMS_NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    console.log("Saved notifications to storage. Count:", notifications.length);
  } catch (err) {
    console.error("Error saving notifications to storage:", err);
  }
};

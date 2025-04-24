import { Testimonial, SMSNotification } from "@/types";

const TESTIMONIALS_KEY = 'testimonials_data';
const NOTIFICATIONS_KEY = 'notifications_data';

export const loadTestimonialsFromStorage = (): Testimonial[] => {
  try {
    const stored = localStorage.getItem(TESTIMONIALS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading testimonials:', error);
    return [];
  }
};

export const saveTestimonialsToStorage = (testimonials: Testimonial[]) => {
  try {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
  } catch (error) {
    console.error('Error saving testimonials:', error);
  }
};

export const loadNotificationsFromStorage = (): SMSNotification[] => {
  try {
    const stored = localStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
};

export const saveNotificationsToStorage = (notifications: SMSNotification[]) => {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
};
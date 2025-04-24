/**
 * storage.ts
 * Handles data persistence using both Supabase and localStorage as a fallback.
 * Provides functions to load and save testimonials and notifications.
 */

import { Testimonial, SMSNotification } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Load testimonials with Supabase as primary storage and localStorage as fallback
export const loadTestimonialsFromStorage = async (): Promise<Testimonial[]> => {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (testimonials?.length) {
      localStorage.setItem("testimonials", JSON.stringify(testimonials));
      return testimonials;
    }

    return JSON.parse(localStorage.getItem("testimonials") || "[]");
  } catch (err) {
    console.error("Storage error:", err);
    return JSON.parse(localStorage.getItem("testimonials") || "[]");
  }
};

// Save testimonials to both Supabase and localStorage
export const saveTestimonialsToStorage = async (testimonials: Testimonial[]): Promise<void> => {
  try {
    localStorage.setItem("testimonials", JSON.stringify(testimonials));

    await supabase
      .from('testimonials')
      .upsert(testimonials.map(t => ({ ...t, created_at: t.createdAt })));
  } catch (err) {
    console.error("Save error:", err);
  }
};

// Local storage operations for notifications
export const loadNotificationsFromStorage = (): SMSNotification[] => 
  JSON.parse(localStorage.getItem("smsNotifications") || "[]");

export const saveNotificationsToStorage = (notifications: SMSNotification[]): void => {
  try {
    localStorage.setItem("smsNotifications", JSON.stringify(notifications));
  } catch (err) {
    console.error("Notification save error:", err);
  }
};
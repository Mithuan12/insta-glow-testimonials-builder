
/**
 * storage.ts
 * Handles data persistence using Supabase as primary storage
 */
import { Testimonial, SMSNotification } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const loadTestimonialsFromStorage = async (): Promise<Testimonial[]> => {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase load error:", error);
      throw error;
    }

    return testimonials || [];
  } catch (err) {
    console.error("Failed to load testimonials:", err);
    return [];
  }
};

export const saveTestimonialToStorage = async (testimonial: Testimonial): Promise<void> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .insert({
        id: testimonial.id,
        name: testimonial.customerName,
        phone: testimonial.customerPhone,
        email: testimonial.customerEmail,
        message: testimonial.message,
        rating: testimonial.rating,
        media_type: testimonial.mediaType,
        media_url: testimonial.mediaUrl,
        created_at: testimonial.createdAt,
        published: testimonial.published
      });

    if (error) throw error;
  } catch (err) {
    console.error("Failed to save testimonial:", err);
    throw err;
  }
};

// Local storage for notifications only
export const loadNotificationsFromStorage = (): SMSNotification[] => 
  JSON.parse(localStorage.getItem("smsNotifications") || "[]");

export const saveNotificationsToStorage = (notifications: SMSNotification[]): void => {
  localStorage.setItem("smsNotifications", JSON.stringify(notifications));
};

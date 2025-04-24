
import { Testimonial, SMSNotification } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export const loadTestimonialsFromStorage = async (): Promise<Testimonial[]> => {
  try {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return testimonials || [];
  } catch (err) {
    console.error("Error loading testimonials:", err);
    return [];
  }
};

export const saveTestimonialsToStorage = async (testimonials: Testimonial[]): Promise<void> => {
  try {
    const { error } = await supabase
      .from('testimonials')
      .upsert(
        testimonials.map(t => ({
          ...t,
          created_at: t.createdAt
        }))
      );

    if (error) throw error;
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

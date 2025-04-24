import React, { createContext, useState, useContext, useCallback, useEffect } from "react";
import { Testimonial, SMSNotification } from "@/types";
import { TestimonialContextType } from "./testimonials/types";
import { defaultTemplates } from "./testimonials/templateData";
//Import Supabase Client
import { createClient } from '@supabase/supabase-js'

//Supabase Configuration (replace with your actual config)
const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY')

const supabaseTestimonialsTable = 'testimonials' //Name of your Supabase table

const supabaseNotificationsTable = 'notifications' //Name of your Supabase table


const TestimonialContext = createContext<TestimonialContextType | undefined>(undefined);

export const TestimonialProvider = ({ children }: { children: React.ReactNode }) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Assumed implementation - needs to be defined elsewhere to work correctly.
  const saveTestimonialsToStorage = async (testimonial: Testimonial) => {
    try {
      const { data, error } = await supabase
        .from(supabaseTestimonialsTable)
        .insert([testimonial]);
      if (error) {
        console.error("Error saving testimonial:", error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Assumed implementation - needs to be defined elsewhere to work correctly.
  const loadTestimonialsFromStorage = async () => {
    try {
      const { data, error } = await supabase
        .from(supabaseTestimonialsTable)
        .select('*');
      if (error) {
        console.error("Error loading testimonials:", error);
        throw error;
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  };

  const { addSMSNotification } = useTestimonialActions(setTestimonials, setNotifications);

  const addTestimonial = useCallback(async (testimonial: Testimonial) => {
    await saveTestimonialsToStorage(testimonial);
    const updatedTestimonials = await loadTestimonialsFromStorage();
    setTestimonials(updatedTestimonials);
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { data: testimonialsData, error: testimonialsError } = await supabase
          .from(supabaseTestimonialsTable)
          .select('*');
        if (testimonialsError) {
          console.error("Error fetching testimonials from Supabase:", testimonialsError);
          setError("Failed to load testimonials");
        } else {
          setTestimonials(testimonialsData || []);
        }
          const { data: notificationsData, error: notificationsError } = await supabase
            .from(supabaseNotificationsTable)
            .select('*');
          if (notificationsError) {
            console.error("Error fetching notifications from Supabase:", notificationsError);
            setError("Failed to load notifications");
          } else {
            setNotifications(notificationsData || []);
          }
      } catch (err) {
        console.error("Error initializing data:", err);
        setError("Failed to load data");
      }
    };
    initializeData();
  }, []);

  const loadTestimonials = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from(supabaseTestimonialsTable)
        .select('*');
      if (error) {
        console.error("Error loading testimonials:", error);
        setError("Failed to load testimonials");
      } else {
        setTestimonials(data || []);
      }
    } catch (err) {
      console.error("Error loading testimonials:", err);
      setError("Failed to load testimonials");
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from(supabaseNotificationsTable)
        .select('*');
      if (error) {
        console.error("Error loading notifications:", error);
        setError("Failed to load notifications");
      } else {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
      setError("Failed to load notifications");
    }
  }, []);

  const updateTestimonial = useCallback(async (id: string, update: Partial<Testimonial>) => {
    try {
      const { data, error } = await supabase
        .from(supabaseTestimonialsTable)
        .update(update)
        .eq('id', id);
      if (error) {
        console.error("Error updating testimonial:", error);
        setError("Failed to update testimonial");
      } else {
        loadTestimonials(); //Refresh after update
      }
    } catch (err) {
      console.error("Error updating testimonial:", err);
      setError("Failed to update testimonial");
    }
  }, []);

  const deleteTestimonial = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from(supabaseTestimonialsTable)
        .delete()
        .eq('id', id);
      if (error) {
        console.error("Error deleting testimonial:", error);
        setError("Failed to delete testimonial");
      } else {
        loadTestimonials(); //Refresh after delete
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError("Failed to delete testimonial");
    }
  }, []);

  return (
    <TestimonialContext.Provider
      value={{
        testimonials,
        templates: defaultTemplates,
        notifications,
        addTestimonial,
        addSMSNotification,
        updateTestimonial,
        deleteTestimonial,
        loading,
        error,
        loadTestimonials,
        loadNotifications,
      }}
    >
      {children}
    </TestimonialContext.Provider>
  );
};

export const useTestimonials = () => {
  const context = useContext(TestimonialContext);
  if (!context) throw new Error("useTestimonials must be used within TestimonialProvider");
  return context;
};
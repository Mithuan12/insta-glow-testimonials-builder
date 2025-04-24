
import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { SMSNotification } from "@/types";
import { saveNotificationsToStorage } from "./storage";

export const useTestimonialActions = (
  setNotifications: React.Dispatch<React.SetStateAction<SMSNotification[]>>,
) => {
  const { toast } = useToast();

  const addSMSNotification = useCallback((notification: Omit<SMSNotification, "id" | "createdAt" | "formUrl" | "status">) => {
    const formId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const formUrl = `${window.location.origin}/form/${formId}`;
    
    const newNotification: SMSNotification = {
      ...notification,
      id: `sms-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'sent',
      formUrl,
    };
    
    setNotifications(prev => {
      const updated = [...prev, newNotification];
      saveNotificationsToStorage(updated);
      return updated;
    });
    
    toast({ title: "Success", description: `WhatsApp notification prepared.` });
  }, [setNotifications, toast]);

  return { addSMSNotification };
};

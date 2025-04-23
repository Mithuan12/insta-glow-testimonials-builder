
import * as z from "zod";

export const testimonialFormSchema = z.object({
  customerName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  customerPhone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  customerEmail: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  message: z.string().min(5, {
    message: "Testimonial must be at least 5 characters.",
  }),
  rating: z.number().min(1).max(5),
  mediaType: z.enum(["text", "audio", "video"]),
});

export type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

export interface Testimonial {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  rating: number;
  createdAt: string;
  template?: string;
  published: boolean;
  imageUrl?: string;
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  background: string;
  textPosition: 'top' | 'center' | 'bottom';
  textAlignment: 'left' | 'center' | 'right';
  textColor: string;
  font: string;
}

export interface SMSNotification {
  id: string;
  customerPhone: string;
  customerName: string;
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
  formUrl: string;
}

export interface NewTestimonial {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  message: string;
  rating: number;
}

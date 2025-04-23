
import React from "react";
import Navbar from "@/components/Navbar";
import SMSForm from "@/components/SMSForm";
import NotificationList from "@/components/NotificationList";
import { TestimonialProvider } from "@/context/TestimonialContext";

const SendFormPage = () => {
  return (
    <TestimonialProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Send Testimonial Form</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="max-w-md mx-auto w-full">
              <SMSForm />
            </div>
            <div className="w-full">
              <NotificationList />
            </div>
          </div>
        </main>
      </div>
    </TestimonialProvider>
  );
};

export default SendFormPage;

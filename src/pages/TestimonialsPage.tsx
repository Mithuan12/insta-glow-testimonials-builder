
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import TestimonialList from "@/components/TestimonialList";
import { TestimonialProvider, useTestimonials } from "@/context/TestimonialContext";

const TestimonialsContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Testimonials</h1>
        <TestimonialList />
      </main>
    </div>
  );
};

const TestimonialsPage = () => {
  return (
    <TestimonialProvider>
      <TestimonialsContent />
    </TestimonialProvider>
  );
};

export default TestimonialsPage;

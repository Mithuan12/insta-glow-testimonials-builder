
import React from "react";
import Navbar from "@/components/Navbar";
import TestimonialList from "@/components/TestimonialList";
import { TestimonialProvider } from "@/context/TestimonialContext";

const TestimonialsPage = () => {
  return (
    <TestimonialProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container py-8">
          <h1 className="text-3xl font-bold mb-6">Testimonials</h1>
          <TestimonialList />
        </main>
      </div>
    </TestimonialProvider>
  );
};

export default TestimonialsPage;

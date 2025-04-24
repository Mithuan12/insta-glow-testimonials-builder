
import React from "react";
import TestimonialForm from "@/components/TestimonialForm";
import { TestimonialProvider } from "@/context/TestimonialContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const FormContent = () => {
  const [submitted, setSubmitted] = React.useState(false);
  
  return submitted ? (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-md p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg"
    >
      <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-purple-600 text-transparent bg-clip-text">Thank You!</h1>
      <p className="text-xl mb-6">Your testimonial has been submitted successfully.</p>
      <Button onClick={() => window.close()}>Close Window</Button>
    </motion.div>
  ) : (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md"
    >
      <TestimonialForm onSuccess={() => setSubmitted(true)} />
    </motion.div>
  );
};

const TestimonialFormPage = () => (
  <TestimonialProvider>
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-brand-500 to-purple-500">
      <FormContent />
    </div>
  </TestimonialProvider>
);

export default TestimonialFormPage;


import React from "react";
import TestimonialForm from "@/components/TestimonialForm";
import { TestimonialProvider } from "@/context/TestimonialContext";
import { Button } from "@/components/ui/button";

const FormContent = () => {
  const [submitted, setSubmitted] = React.useState(false);
  
  return submitted ? (
    <div className="text-center max-w-md">
      <h1 className="text-3xl font-bold gradient-text mb-4">Thank You!</h1>
      <p className="text-xl mb-6">Your testimonial has been submitted successfully.</p>
      <Button variant="outline" onClick={() => window.close()}>Close Window</Button>
    </div>
  ) : (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Share Your Feedback</h1>
        <p className="text-muted-foreground">We value your opinion!</p>
      </div>
      <TestimonialForm onSuccess={() => setSubmitted(true)} />
    </div>
  );
};

const TestimonialFormPage = () => (
  <TestimonialProvider>
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-brand-50 to-white">
      <FormContent />
    </div>
  </TestimonialProvider>
);

export default TestimonialFormPage;

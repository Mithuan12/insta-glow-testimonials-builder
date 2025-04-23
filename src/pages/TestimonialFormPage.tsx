
import React from "react";
import { useParams } from "react-router-dom";
import TestimonialForm from "@/components/TestimonialForm";
import { TestimonialProvider } from "@/context/TestimonialContext";
import { Button } from "@/components/ui/button";

const TestimonialFormPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-brand-50 to-white">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold gradient-text mb-4">Thank You!</h1>
          <p className="text-xl mb-6">
            Your testimonial has been submitted successfully.
          </p>
          <Button variant="outline" onClick={() => window.close()}>Close Window</Button>
        </div>
      </div>
    );
  }

  return (
    <TestimonialProvider>
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-brand-50 to-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold gradient-text mb-2">Share Your Feedback</h1>
            <p className="text-muted-foreground">
              We value your opinion! Please take a moment to share your experience with us.
            </p>
          </div>
          <TestimonialForm onSuccess={() => setSubmitted(true)} />
        </div>
      </div>
    </TestimonialProvider>
  );
};

export default TestimonialFormPage;

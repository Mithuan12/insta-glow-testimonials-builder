
import React from "react";
import { Testimonial, Template } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TestimonialPreviewProps = {
  testimonial: Testimonial;
  template: Template;
};

const TestimonialPreview: React.FC<TestimonialPreviewProps> = ({
  testimonial,
  template,
}) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 justify-center mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? "text-amber-400" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderTestimonial = () => {
    return (
      <div
        className={cn(
          `instagram-post mx-auto ${template.background}`,
          {
            "flex items-start justify-center": template.textPosition === "top",
            "flex items-center justify-center": template.textPosition === "center",
            "flex items-end justify-center": template.textPosition === "bottom",
          }
        )}
      >
        <div
          className={cn(
            "p-8 w-full",
            {
              "text-left": template.textAlignment === "left",
              "text-center": template.textAlignment === "center",
              "text-right": template.textAlignment === "right",
            },
            template.textColor,
            template.font
          )}
        >
          {renderStars(testimonial.rating)}
          <p className="text-xl mb-4 font-semibold">"{testimonial.message}"</p>
          <p className="text-lg font-medium">- {testimonial.customerName}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {renderTestimonial()}
      </CardContent>
    </Card>
  );
};

export default TestimonialPreview;

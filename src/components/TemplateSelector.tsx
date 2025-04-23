
import React, { useState } from "react";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Template } from "@/types";

type TemplateSelectorProps = {
  onSelect: (templateId: string) => void;
  selectedTemplateId?: string;
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  onSelect,
  selectedTemplateId,
}) => {
  const { templates } = useTestimonials();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`overflow-hidden cursor-pointer transition-all ${
            template.id === selectedTemplateId
              ? "ring-2 ring-primary"
              : "hover:shadow-md"
          }`}
          onClick={() => onSelect(template.id)}
        >
          <CardContent className="p-2">
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {/* Placeholder for template thumbnail */}
              <div className={`w-full h-full ${template.background} flex items-center justify-center`}>
                <p className={`text-xl ${template.textColor} ${template.font} px-4`}>
                  Sample testimonial preview
                </p>
              </div>
            </div>
            <div className="mt-2 text-center font-medium">{template.name}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TemplateSelector;


import React, { useState } from "react";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Edit, Image, X } from "lucide-react";
import TemplateSelector from "./TemplateSelector";
import TestimonialPreview from "./TestimonialPreview";

const TestimonialList = () => {
  const { testimonials, templates, updateTestimonial, deleteTestimonial } = useTestimonials();
  const [activeTestimonial, setActiveTestimonial] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleApplyTemplate = async (testimonialId: string, templateId: string) => {
    await updateTestimonial(testimonialId, { template: templateId });
    setActiveTestimonial(null);
    setSelectedTemplate(null);
  };

  const handlePublish = async (testimonialId: string) => {
    await updateTestimonial(testimonialId, { published: true });
  };

  const handleUnpublish = async (testimonialId: string) => {
    await updateTestimonial(testimonialId, { published: false });
  };

  const handleDelete = async (testimonialId: string) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      await deleteTestimonial(testimonialId);
    }
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${star <= rating ? "text-amber-400" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {testimonials.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No testimonials yet. Start collecting feedback from your customers!
          </CardContent>
        </Card>
      ) : (
        testimonials.map((testimonial) => (
          <Card key={testimonial.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{testimonial.customerName}</CardTitle>
                  <CardDescription>
                    {format(new Date(testimonial.createdAt), "PP")}
                  </CardDescription>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {renderRating(testimonial.rating)}
                <p className="text-lg">{testimonial.message}</p>
                <div className="flex gap-2">
                  <div className="text-sm text-muted-foreground">
                    Phone: {testimonial.customerPhone}
                  </div>
                  {testimonial.customerEmail && (
                    <div className="text-sm text-muted-foreground">
                      Email: {testimonial.customerEmail}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                {testimonial.published ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnpublish(testimonial.id)}
                  >
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handlePublish(testimonial.id)}
                  >
                    Publish
                  </Button>
                )}
              </div>
              <Dialog
                open={activeTestimonial === testimonial.id}
                onOpenChange={(open) => {
                  if (open) {
                    setActiveTestimonial(testimonial.id);
                    setSelectedTemplate(testimonial.template || templates[0].id);
                  } else {
                    setActiveTestimonial(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Image className="mr-2 h-4 w-4" />
                    Create Instagram Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Create Instagram Post</DialogTitle>
                  </DialogHeader>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Choose Template</h3>
                      <TemplateSelector
                        onSelect={setSelectedTemplate}
                        selectedTemplateId={selectedTemplate || undefined}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Preview</h3>
                      {selectedTemplate && (
                        <TestimonialPreview
                          testimonial={testimonial}
                          template={templates.find(t => t.id === selectedTemplate)!}
                        />
                      )}
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() =>
                            selectedTemplate &&
                            handleApplyTemplate(testimonial.id, selectedTemplate)
                          }
                        >
                          Apply Template & Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default TestimonialList;

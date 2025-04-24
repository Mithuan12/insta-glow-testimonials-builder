
import React, { useEffect } from "react";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, Image } from "lucide-react";
import NotificationList from "./NotificationList";
import TestimonialDisplay from "./TestimonialDisplay";

const Dashboard = () => {
  const { testimonials, notifications, loadTestimonials, loadNotifications } = useTestimonials();
  
  useEffect(() => {
    // Ensure testimonials and notifications are loaded when dashboard mounts
    const loadData = async () => {
      console.log("Dashboard: Loading data");
      await loadTestimonials();
      await loadNotifications();
    };
    
    loadData();
  }, [loadTestimonials, loadNotifications]);
  
  console.log("Current testimonials in Dashboard:", testimonials); // Debug log
  
  const publishedTestimonials = testimonials.filter(t => t.published);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Testimonials</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testimonials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedTestimonials.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SMS Notifications</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <NotificationList />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Recent Testimonials</h2>
          {testimonials.length > 0 ? (
            <div className="space-y-4">
              {testimonials.slice(0, 3).map(testimonial => (
                <TestimonialDisplay key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No testimonials yet.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

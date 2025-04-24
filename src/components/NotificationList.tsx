import React, { useEffect } from "react";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationList = () => {
  const { notifications, loadNotifications } = useTestimonials();
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  console.log("Current notifications in NotificationList:", notifications);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Link copied to clipboard!",
    });
  };

  const handleRefresh = () => {
    loadNotifications();
    toast({
      description: "Notifications refreshed",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent WhatsApp Notifications</h2>
        <Button variant="ghost" size="sm" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>
      
      {notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No form links sent yet.
          </CardContent>
        </Card>
      ) : (
        notifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{notification.customerName}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(notification.createdAt), "PP")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm">
                  WhatsApp: <span className="font-mono">{notification.customerPhone}</span>
                </div>
                <div className="text-sm">
                  Status: 
                  <span className={`ml-1 ${
                    notification.status === "sent" 
                      ? "text-green-600"
                      : notification.status === "failed"
                        ? "text-red-600"
                        : "text-amber-600"
                  }`}>
                    {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm truncate flex-1">
                    Form URL: <span className="text-muted-foreground">{notification.formUrl}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(notification.formUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default NotificationList;

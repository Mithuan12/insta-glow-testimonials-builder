
import React from "react";
import { useTestimonials } from "@/context/TestimonialContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const NotificationList = () => {
  const { notifications, loadNotifications } = useTestimonials();
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: "Link copied to clipboard!" });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent WhatsApp Notifications</h2>
        <Button variant="ghost" size="sm" onClick={() => {
          loadNotifications();
          toast({ description: "Notifications refreshed" });
        }}>
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      </div>
      
      {!notifications.length ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            No form links sent yet.
          </CardContent>
        </Card>
      ) : (
        notifications.map(({ id, customerName, createdAt, customerPhone, status, formUrl }) => (
          <Card key={id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{customerName}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {format(new Date(createdAt), "PP")}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">WhatsApp: <span className="font-mono">{customerPhone}</span></p>
                <p className="text-sm">
                  Status: 
                  <span className={`ml-1 ${status === "sent" ? "text-green-600" : status === "failed" ? "text-red-600" : "text-amber-600"}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm truncate flex-1">
                    Form URL: <span className="text-muted-foreground">{formUrl}</span>
                  </p>
                  <Button variant="ghost" size="icon" onClick={() => handleCopy(formUrl)}>
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

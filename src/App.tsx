
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TestimonialsPage from "./pages/TestimonialsPage";
import SendFormPage from "./pages/SendFormPage";
import TestimonialFormPage from "./pages/TestimonialFormPage";
import AuthPage from "./pages/AuthPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  return session ? <>{children}</> : <Navigate to="/auth" />;
};

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={session ? <Navigate to="/" /> : <AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Index />
          </PrivateRoute>
        }
      />
      <Route
        path="/testimonials"
        element={
          <PrivateRoute>
            <TestimonialsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/send-form"
        element={
          <PrivateRoute>
            <SendFormPage />
          </PrivateRoute>
        }
      />
      <Route path="/form/:formId" element={<TestimonialFormPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

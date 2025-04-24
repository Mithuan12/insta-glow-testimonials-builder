
import React from "react";
import Navbar from "@/components/Navbar";
import Dashboard from "@/components/Dashboard";
import { TestimonialProvider } from "@/context/TestimonialContext";

const DashboardContent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <Dashboard />
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <TestimonialProvider>
      <DashboardContent />
    </TestimonialProvider>
  );
};

export default Index;

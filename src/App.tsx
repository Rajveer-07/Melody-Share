import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { MusicCommunityProvider } from "./context/MusicCommunityContext";
import Onboarding from "./pages/Onboarding";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import AnimatedWrapper from "./components/AnimatedWrapper";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatedWrapper
      id={location.pathname}
      transitionType="swift"
      direction="up"
      duration={0.7}
    >
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Onboarding />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/join/:code" element={<Onboarding />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatedWrapper>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MusicCommunityProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/Melody-Share">
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </MusicCommunityProvider>
  </QueryClientProvider>
);

export default App;
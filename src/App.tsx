import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MusicCommunityProvider } from "./context/MusicCommunityContext";
import Onboarding from "./pages/Onboarding";
import Feed from "./pages/Feed";
import NotFound from "./pages/NotFound";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const queryClient = new QueryClient();

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Onboarding />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicCommunityProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/Melody-Share">
          <AnimatedRoutes />
        </BrowserRouter>
      </MusicCommunityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
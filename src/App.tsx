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

// Optional Layout component for consistent styling
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    {/* Add Header or Navbar here if needed */}
    <main className="flex-grow">{children}</main>
    {/* Add Footer here if needed */}
  </div>
);

// AnimatedRoutes component to handle page transitions
const AnimatedRoutes = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Onboarding />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/join/:code" element={<Onboarding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MusicCommunityProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </MusicCommunityProvider>
  </QueryClientProvider>
);

export default App;
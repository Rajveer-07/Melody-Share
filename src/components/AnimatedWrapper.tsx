
import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { pageTransition } from "../lib/animation-utils";

interface AnimatedWrapperProps {
  children: React.ReactNode; // The content to be wrapped and animated
  id?: string; // Unique identifier for the motion.div key, defaults to "page"
  disableAnimations?: boolean; // If true, skips animations and renders a plain div
  customVariants?: Variants; // Custom animation variants to override the default pageTransition
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  id = "page",
  disableAnimations = false,
  customVariants,
}) => {
  // If animations are disabled, render a plain div to avoid animation overhead
  if (disableAnimations) {
    return <div className="w-full h-full">{children}</div>;
  }

  // Use custom variants if provided, otherwise fall back to the default pageTransition
  const variants = customVariants || pageTransition;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id} // Ensures Framer Motion tracks this component uniquely
        initial="initial" // Starting animation state
        animate="animate" // Target animation state
        exit="exit" // Animation state when unmounting
        variants={variants} // Animation definitions for each state
        className="w-full h-full" // Full width and height for layout consistency
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedWrapper;

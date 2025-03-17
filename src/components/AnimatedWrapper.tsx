
import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { pageTransition, swiftTransition } from "../lib/animation-utils";

export type TransitionType = 
  | "default" 
  | "swift" 
  | "slide" 
  | "scale" 
  | "fade" 
  | "asymmetric" 
  | "identity";

interface AnimatedWrapperProps {
  children: React.ReactNode; // The content to be wrapped and animated
  id?: string; // Unique identifier for the motion.div key, defaults to "page"
  disableAnimations?: boolean; // If true, skips animations and renders a plain div
  customVariants?: Variants; // Custom animation variants to override the default pageTransition
  transitionType?: TransitionType; // Type of transition to use
  direction?: "up" | "down" | "left" | "right"; // Direction for slide transitions
  duration?: number; // Duration of the animation in seconds
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  id = "page",
  disableAnimations = false,
  customVariants,
  transitionType = "default",
  direction = "up",
  duration = 0.5,
}) => {
  // If animations are disabled, render a plain div to avoid animation overhead
  if (disableAnimations) {
    return <div className="w-full h-full">{children}</div>;
  }

  // Select the appropriate variants based on transitionType
  let variants = customVariants || pageTransition;

  if (!customVariants) {
    switch (transitionType) {
      case "swift":
        variants = swiftTransition(direction, duration);
        break;
      case "slide":
        variants = {
          initial: { 
            x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
            y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
            opacity: 0 
          },
          animate: { 
            x: 0, 
            y: 0, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration,
            }
          },
          exit: { 
            x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
            y: direction === 'up' ? -30 : direction === 'down' ? 30 : 0,
            opacity: 0,
            transition: { duration: duration * 0.75 } 
          }
        };
        break;
      case "scale":
        variants = {
          initial: { scale: 0.95, opacity: 0 },
          animate: { 
            scale: 1, 
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration,
            }
          },
          exit: { scale: 0.95, opacity: 0, transition: { duration: duration * 0.75 } }
        };
        break;
      case "fade":
        variants = {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration } },
          exit: { opacity: 0, transition: { duration: duration * 0.75 } }
        };
        break;
      case "asymmetric":
        variants = {
          initial: { opacity: 0, y: 20 },
          animate: { 
            opacity: 1, 
            y: 0,
            transition: {
              type: "spring",
              stiffness: 400,
              damping: 30,
              duration,
            }
          },
          exit: { opacity: 0, scale: 0.95, transition: { duration: duration * 0.5 } }
        };
        break;
      case "identity":
        // No animation, but still within the AnimatePresence context
        variants = {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 }
        };
        break;
      default:
        variants = pageTransition;
        break;
    }
  }

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

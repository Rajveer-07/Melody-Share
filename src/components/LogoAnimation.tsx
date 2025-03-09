import React, { useEffect } from "react";
import { motion, useAnimationControls, Variants } from "framer-motion";
import { Music } from "lucide-react";

// Define props interface for type safety
interface LogoAnimationProps {
  size?: number; // Size of the logo in pixels (default: 48)
  className?: string; // Custom classes for styling (default: "")
  repeat?: boolean; // Toggle animation repeat (default: true)
  repeatInterval?: number; // Repeat interval in milliseconds (default: 5000)
}

const LogoAnimation: React.FC<LogoAnimationProps> = ({
  size = 48,
  className = "",
  repeat = true,
  repeatInterval = 5000,
}) => {
  // Animation controls for the icon and circle
  const iconControls = useAnimationControls();
  const circleControls = useAnimationControls();

  // Icon animation variants
  const iconVariants: Variants = {
    rest: { rotate: 0, scale: 1 },
    animate: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 1.2, ease: "easeInOut" },
    },
  };

  // Circle animation variants
  const circleVariants: Variants = {
    rest: { scale: 1, opacity: 0.6 },
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.6, 1, 0.6],
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  // Animation sequence logic
  useEffect(() => {
    const animateSequence = () => {
      // Start icon animation
      iconControls.start("animate");
      // Start circle animation with a 0.3s delay for overlap
      circleControls.start("animate", { delay: 0.3 });
    };

    // Trigger animation on mount
    animateSequence();

    // Set up repeating animation if enabled
    if (repeat) {
      const interval = setInterval(animateSequence, repeatInterval);
      // Cleanup interval on unmount
      return () => clearInterval(interval);
    }
  }, [iconControls, circleControls, repeat, repeatInterval]);

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }} // Explicit size for layout consistency
    >
      <motion.div
        variants={circleVariants}
        initial="rest"
        animate={circleControls}
        className="absolute inset-0 bg-music-accent/30 rounded-full"
      />
      <motion.div
        variants={iconVariants}
        initial="rest"
        animate={iconControls}
        className="relative z-10 flex items-center justify-center w-full h-full"
      >
        <Music size={size} className="text-music-accent" />
      </motion.div>
    </div>
  );
};

export default LogoAnimation;

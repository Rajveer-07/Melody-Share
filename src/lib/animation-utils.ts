import { Variants } from "framer-motion";

// Common animation variants for Framer Motion
export const fadeIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

export const scaleIn = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

export const slideInRight = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

export const slideInLeft = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      delay,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
});

export const staggerChildren = (staggerTime: number = 0.1): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
    },
  },
});

export const musicCardHover = {
  rest: { scale: 1, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" },
  hover: { 
    scale: 1.03, 
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    }
  },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: 0.1,
    }
  },
};

// Advanced page transitions
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.15,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3,
    }
  },
};

// Swift-inspired transitions
export const swiftTransition = (direction: "up" | "down" | "left" | "right" = "up", duration: number = 0.5): Variants => {
  const xOffset = direction === "left" ? 30 : direction === "right" ? -30 : 0;
  const yOffset = direction === "up" ? 30 : direction === "down" ? -30 : 0;

  return {
    initial: { 
      opacity: 0, 
      x: xOffset, 
      y: yOffset,
      filter: "blur(8px)",
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      y: 0,
      filter: "blur(0px)",
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30, duration },
        y: { type: "spring", stiffness: 300, damping: 30, duration },
        opacity: { duration: duration * 0.7 },
        filter: { duration: duration * 0.7 },
      }
    },
    exit: { 
      opacity: 0, 
      x: direction === "left" ? -20 : direction === "right" ? 20 : 0,
      y: direction === "up" ? -20 : direction === "down" ? 20 : 0,
      filter: "blur(4px)",
      transition: { 
        duration: duration * 0.5,
      } 
    }
  };
};

// SwiftUI-inspired spring animation
export const springTransition = (delay: number = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 1,
      delay,
      duration: 0.8,
    },
  },
});

// Material transition with elevation and shadow
export const elevationTransition = {
  initial: { 
    opacity: 0, 
    y: 20, 
    boxShadow: "0px 0px 0px rgba(0,0,0,0)"
  },
  animate: { 
    opacity: 1, 
    y: 0, 
    boxShadow: "0px 10px 25px rgba(0,0,0,0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      duration: 0.7,
    }
  },
  exit: { 
    opacity: 0, 
    y: 10, 
    boxShadow: "0px 0px 0px rgba(0,0,0,0)",
    transition: { duration: 0.3 } 
  }
};

// Match the iOS modal presentation style
export const modalTransition = {
  initial: { opacity: 0, y: 50, scale: 0.97 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.5,
    }
  },
  exit: { 
    opacity: 0, 
    y: 30, 
    scale: 0.97,
    transition: { duration: 0.3 } 
  }
};

// More complex staggered animations
export const containerWithStagger = (delay: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: delay,
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
});

export const itemWithBounce: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    },
  },
};

// Music-specific animations
export const pulseOnBeat = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    },
  },
};

export const wavyText = (delay: number = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay,
      staggerChildren: 0.05,
    },
  },
});

export const wavyCharacter = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

// List container and items (for feed items)
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    }
  }
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500
    }
  }
};

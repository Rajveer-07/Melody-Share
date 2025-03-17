
import React from 'react';
import { motion, Variants, VariantLabels, TargetAndTransition, AnimationControls } from 'framer-motion';

export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right' = 'up', delay: number = 0): Variants => {
  return {
    hidden: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1.25,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  };
};

export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0): Variants => {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren,
        delayChildren
      }
    }
  };
};

export const scaleIn = (delay: number = 0): Variants => {
  return {
    hidden: {
      scale: 0.9,
      opacity: 0
    },
    show: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        duration: 1.1,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  };
};

export const slideIn = (direction: 'up' | 'down' | 'left' | 'right', type: string, delay: number, duration: number): Variants => {
  return {
    hidden: {
      x: direction === 'left' ? '-100%' : direction === 'right' ? '100%' : 0,
      y: direction === 'up' ? '100%' : direction === 'down' ? '-100%' : 0
    },
    show: {
      x: 0,
      y: 0,
      transition: {
        type,
        delay,
        duration,
        ease: 'easeOut'
      }
    }
  };
};

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  initial?: boolean | VariantLabels | TargetAndTransition;
  animate?: boolean | VariantLabels | TargetAndTransition | AnimationControls;
  exit?: VariantLabels | TargetAndTransition;
  transition?: object;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  type?: 'tween' | 'spring' | 'inertia';
  staggerChildren?: number;
  duration?: number;
  containerVariants?: 'fade' | 'scale' | 'slide' | 'stagger' | 'none';
}

const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  className = '',
  variants,
  initial = 'hidden',
  animate = 'show',
  exit = 'hidden',
  transition,
  delay = 0,
  direction = 'up',
  type = 'spring',
  staggerChildren = 0.1,
  duration = 0.5,
  containerVariants = 'fade'
}) => {
  let variantsMap = variants;
  
  if (!variants) {
    switch (containerVariants) {
      case 'fade':
        variantsMap = fadeIn(direction, delay);
        break;
      case 'scale':
        variantsMap = scaleIn(delay);
        break;
      case 'slide':
        variantsMap = slideIn(direction, type, delay, duration);
        break;
      case 'stagger':
        variantsMap = staggerContainer(staggerChildren, delay);
        break;
      default:
        variantsMap = {};
    }
  }

  return (
    <motion.div
      className={className}
      variants={variantsMap}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;

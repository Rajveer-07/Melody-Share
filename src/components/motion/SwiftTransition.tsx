
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { swiftTransition, springTransition, modalTransition, elevationTransition } from '../../lib/animation-utils';

export type SwiftTransitionType = 
  | 'default'
  | 'spring'
  | 'modal'
  | 'elevation'
  | 'none';

interface SwiftTransitionProps {
  children: React.ReactNode;
  className?: string;
  type?: SwiftTransitionType;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  staggerIndex?: number;
  id?: string;
}

const SwiftTransition: React.FC<SwiftTransitionProps> = ({
  children,
  className = '',
  type = 'default',
  direction = 'up',
  duration = 0.5,
  delay = 0,
  staggerIndex = 0,
  id,
}) => {
  // Calculate the actual delay, accounting for staggering
  const actualDelay = delay + (staggerIndex * 0.1);
  
  // Select the appropriate transition based on type
  let variants: Variants;
  
  switch (type) {
    case 'spring':
      variants = springTransition(actualDelay);
      break;
    case 'modal':
      variants = modalTransition;
      break;
    case 'elevation':
      variants = elevationTransition;
      break;
    case 'none':
      variants = {
        hidden: { opacity: 1 },
        visible: { opacity: 1 },
        exit: { opacity: 1 }
      };
      break;
    default:
      variants = swiftTransition(direction, duration);
  }
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{
        delay: actualDelay,
        duration: duration,
        ease: [0.22, 1, 0.36, 1]
      }}
      key={id}
    >
      {children}
    </motion.div>
  );
};

export default SwiftTransition;

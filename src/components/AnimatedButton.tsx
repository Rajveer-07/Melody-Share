
import React from "react";
import { motion } from "framer-motion";
import { buttonHover } from "../lib/animation-utils";
import { cn } from "../lib/utils";

interface AnimatedButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  title?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  icon,
  className,
  disabled,
  onClick,
  type = "button",
  title,
  ...props
}) => {
  const baseStyles = "rounded-full font-medium transition-colors";
  
  const variantStyles = {
    primary: "bg-music-accent hover:bg-music-accentHover text-white",
    outline: "bg-transparent hover:bg-white/10 text-white border border-white/30",
    ghost: "bg-transparent hover:bg-white/5 text-white",
  };
  
  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4",
    lg: "py-3 px-6 text-lg",
  };

  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={buttonHover}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        "flex items-center justify-center",
        className
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
      title={title}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default AnimatedButton;

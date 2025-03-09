
import React from "react";
import { motion, Variants } from "framer-motion";
import { wavyText, wavyCharacter } from "../lib/animation-utils";

interface WavyTextProps {
  text: string;
  className?: string;
  delay?: number;
  animationLevel?: "character" | "word";
  disableAnimations?: boolean;
  parentVariants?: Variants;
  childVariants?: Variants;
}

const WavyText: React.FC<WavyTextProps> = ({
  text,
  className = "",
  delay = 0,
  animationLevel = "character",
  disableAnimations = false,
  parentVariants,
  childVariants,
}) => {
  // Use provided variants or fall back to defaults
  const finalParentVariants = parentVariants || wavyText(delay);
  const finalChildVariants = childVariants || wavyCharacter;

  // If animations are disabled, render plain text
  if (disableAnimations) {
    return <span className={className}>{text}</span>;
  }

  // Split text based on animation level
  let parts: string[];
  if (animationLevel === "character") {
    parts = text.split("");
  } else {
    parts = text.split(/(\s+)/); // Splits into words and whitespace segments
  }

  return (
    <motion.span
      aria-label={text} // Accessibility: full text for screen readers
      className={`inline-block ${className}`}
      variants={finalParentVariants}
      initial="hidden"
      animate="visible"
    >
      {parts.map((part, index) => {
        if (animationLevel === "character") {
          // Character-level animation
          const char = part === " " ? "\u00A0" : part;
          return (
            <motion.span
              key={`${char}-${index}`}
              className="inline-block"
              variants={finalChildVariants}
            >
              {char}
            </motion.span>
          );
        } else {
          // Word-level animation
          if (/\s+/.test(part)) {
            // Preserve whitespace without animation
            return (
              <span key={`${part}-${index}`} style={{ whiteSpace: "pre" }}>
                {part}
              </span>
            );
          } else {
            // Animate words
            return (
              <motion.span
                key={`${part}-${index}`}
                className="inline-block"
                variants={finalChildVariants}
              >
                {part}
              </motion.span>
            );
          }
        }
      })}
    </motion.span>
  );
};

export default WavyText;

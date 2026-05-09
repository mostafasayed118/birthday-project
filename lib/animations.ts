import { Variants } from "framer-motion";

const EASING = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
} as const;

const DURATION = { fast: 0.15, normal: 0.3, slow: 0.5 } as const;
const STAGGER = { children: 0.05, container: 0.1 } as const;

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: STAGGER.children, delayChildren: STAGGER.container } },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASING.easeOut } },
};

export const hoverScale = { scale: 1.03, transition: { duration: DURATION.fast, ease: EASING.sharp } };
export const pulseVariants = { pulse: { scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5], transition: { duration: 1.5, repeat: Infinity, ease: EASING.easeInOut } } };

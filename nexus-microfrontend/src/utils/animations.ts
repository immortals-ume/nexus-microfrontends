/**
 * Animation Utilities with Framer Motion
 * 
 * Reusable animation variants and configurations for consistent animations
 * across the application.
 */

import type { Variants, Transition } from 'framer-motion';

/**
 * Common Transitions
 */
export const transitions = {
  fast: { duration: 0.2, ease: 'easeOut' } as Transition,
  normal: { duration: 0.3, ease: 'easeInOut' } as Transition,
  slow: { duration: 0.5, ease: 'easeInOut' } as Transition,
  spring: { type: 'spring', stiffness: 300, damping: 30 } as Transition,
  bounce: { type: 'spring', stiffness: 400, damping: 10 } as Transition,
} as const;

/**
 * Fade Animations
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.normal,
  },
};

/**
 * Slide Animations
 */
export const slideUpVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: transitions.normal,
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: transitions.fast,
  },
};

export const slideDownVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: transitions.normal,
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: transitions.fast,
  },
};

export const slideInRightVariants: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: transitions.normal,
  },
  exit: { 
    x: '100%', 
    opacity: 0,
    transition: transitions.fast,
  },
};

export const slideInLeftVariants: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: transitions.normal,
  },
  exit: { 
    x: '-100%', 
    opacity: 0,
    transition: transitions.fast,
  },
};

/**
 * Scale Animations
 */
export const scaleVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: transitions.normal,
  },
  exit: { 
    scale: 0.95, 
    opacity: 0,
    transition: transitions.fast,
  },
};

export const scaleInVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: transitions.spring,
  },
};

export const bounceInVariants: Variants = {
  hidden: { scale: 0.3, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: transitions.bounce,
  },
};

/**
 * Hover Animations
 */
export const hoverScale = {
  scale: 1.02,
  transition: transitions.fast,
};

export const hoverLift = {
  y: -4,
  transition: transitions.fast,
};

export const hoverGrow = {
  scale: 1.05,
  transition: transitions.fast,
};

/**
 * Tap Animations
 */
export const tapScale = {
  scale: 0.98,
};

export const tapShrink = {
  scale: 0.95,
};

/**
 * Stagger Animations
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions.normal,
  },
};

/**
 * Modal/Overlay Animations
 */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.fast,
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast,
  },
};

export const modalContentVariants: Variants = {
  hidden: { scale: 0.95, opacity: 0, y: 20 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: transitions.spring,
  },
  exit: { 
    scale: 0.95, 
    opacity: 0, 
    y: 20,
    transition: transitions.fast,
  },
};

export const drawerVariants: Variants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0,
    transition: transitions.normal,
  },
  exit: { 
    x: '100%',
    transition: transitions.fast,
  },
};

/**
 * List Animations
 */
export const listContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const listItem: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions.fast,
  },
};

/**
 * Card Animations
 */
export const cardVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: transitions.normal,
  },
  hover: {
    y: -4,
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
    transition: transitions.fast,
  },
};

/**
 * Notification Animations
 */
export const notificationVariants: Variants = {
  hidden: { 
    x: 400, 
    opacity: 0,
    scale: 0.8,
  },
  visible: { 
    x: 0, 
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: { 
    x: 400, 
    opacity: 0,
    scale: 0.8,
    transition: transitions.fast,
  },
};

/**
 * Page Transition Animations
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: transitions.normal,
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: transitions.fast,
  },
};

/**
 * Collapse/Expand Animations
 */
export const collapseVariants: Variants = {
  collapsed: { 
    height: 0, 
    opacity: 0,
    transition: transitions.fast,
  },
  expanded: { 
    height: 'auto', 
    opacity: 1,
    transition: transitions.normal,
  },
};

/**
 * Shake Animation (for errors)
 */
export const shakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.5 },
  },
};

/**
 * Pulse Animation (for attention)
 */
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

/**
 * Rotation Animation
 */
export const rotateVariants: Variants = {
  rotate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

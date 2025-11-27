/**
 * Animated Components with Framer Motion
 * 
 * Pre-built animated components for common use cases
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import {
  fadeInVariants,
  slideUpVariants,
  slideDownVariants,
  scaleVariants,
  staggerContainer,
  staggerItem,
  cardVariants,
  hoverScale,
  hoverLift,
  tapScale,
} from '../../utils/animations';

/**
 * Fade In Component
 */
export function FadeIn({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide Up Component
 */
export function SlideUp({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideUpVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Slide Down Component
 */
export function SlideDown({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideDownVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Scale In Component
 */
export function ScaleIn({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={scaleVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Container
 * Use with StaggerItem children for staggered animations
 */
export function StaggerContainer({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item
 * Use inside StaggerContainer for staggered animations
 */
export function StaggerItem({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div variants={staggerItem} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * Animated Card
 * Card with hover lift effect
 */
export function AnimatedCard({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={cardVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Animated Button
 * Button with hover and tap animations
 */
export function AnimatedButton({ children, ...props }: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      whileHover={hoverScale}
      whileTap={tapScale}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/**
 * Hover Lift
 * Component that lifts on hover
 */
export function HoverLift({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div whileHover={hoverLift} {...props}>
      {children}
    </motion.div>
  );
}

/**
 * Animated List
 * List with staggered item animations
 */
interface AnimatedListProps extends HTMLMotionProps<'ul'> {
  children: React.ReactNode;
}

export function AnimatedList({ children, ...props }: AnimatedListProps) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.ul>
  );
}

/**
 * Animated List Item
 */
export function AnimatedListItem({ children, ...props }: HTMLMotionProps<'li'>) {
  return (
    <motion.li variants={staggerItem} {...props}>
      {children}
    </motion.li>
  );
}

/**
 * Presence Wrapper
 * Wrapper for AnimatePresence with common settings
 */
interface PresenceWrapperProps {
  children: React.ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
}

export function PresenceWrapper({ children, mode = 'wait' }: PresenceWrapperProps) {
  return <AnimatePresence mode={mode}>{children}</AnimatePresence>;
}

/**
 * Page Transition
 * Wrapper for page-level transitions
 */
export function PageTransition({ children, ...props }: HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

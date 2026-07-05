"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import {
  fadeUpVariants,
  pageVariants,
  scaleInVariants,
  staggerContainer,
  staggerItem,
  transitionMedium,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function FadeIn({ delay = 0, className, children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fadeUpVariants}
      transition={{ ...transitionMedium, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInOnMount({
  delay = 0,
  className,
  children,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUpVariants}
      transition={{ ...transitionMedium, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transitionMedium}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
  ...props
}: HTMLMotionProps<"div">) {
  return (
    <motion.div variants={staggerItem} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  delay = 0,
  className,
  children,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={scaleInVariants}
      transition={{ ...transitionMedium, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

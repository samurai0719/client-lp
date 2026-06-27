"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
};

export default function AnimatedSection({ children, className, id, delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedItem({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

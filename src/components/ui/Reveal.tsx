import { motion } from "framer-motion";
import { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
};

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Reveal({
  children,
  delay = 0,
  y = 28,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.9,
        delay,
        ease: easeOutExpo,
      }}
    >
      {children}
    </motion.div>
  );
}
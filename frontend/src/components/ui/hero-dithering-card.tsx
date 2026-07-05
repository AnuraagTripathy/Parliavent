"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, Suspense, lazy } from "react";
import { Button } from "@/components/ui/button";
import { staggerContainer, staggerItem, transitionMedium } from "@/lib/motion";

const Dithering = lazy(() =>
  import("@paper-design/shaders-react").then((mod) => ({
    default: mod.Dithering,
  })),
);

interface CTASectionProps {
  onStart?: () => void;
}

export function CTASection({ onStart }: CTASectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="flex w-full items-center justify-center px-4 py-8 md:px-8 lg:px-12">
      <motion.div
        className="relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative flex min-h-[520px] flex-col items-center justify-center overflow-hidden rounded-[40px] border border-border bg-card shadow-lg shadow-black/40 duration-500 md:min-h-[600px] lg:min-h-[680px] lg:rounded-[48px]">
          <Suspense
            fallback={
              <div className="absolute inset-0 animate-pulse bg-muted/30" />
            }
          >
            <div className="pointer-events-none absolute inset-0 z-0 opacity-35 mix-blend-screen">
              <Dithering
                colorBack="#00000000"
                colorFront="#EC4E02"
                shape="warp"
                type="4x4"
                speed={isHovered ? 0.6 : 0.2}
                className="size-full"
                minPixelRatio={1}
              />
            </div>
          </Suspense>

          <motion.div
            className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={staggerItem}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Fruitful debate, not fighting
            </motion.div>

            <motion.h2
              variants={staggerItem}
              className="mb-8 font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-7xl lg:text-8xl"
            >
              Think together. <br />
              <span className="text-foreground/75">Not against each other.</span>
            </motion.h2>

            <motion.p
              variants={staggerItem}
              className="mb-12 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              Parliavent is Reddit for people who want to understand — not dunk.
              High-substance arguments, nested threads, and judge review that
              keeps the conversation aimed at truth and learning, not winning.
            </motion.p>

            <motion.div variants={staggerItem}>
              <Button
                size="lg"
                onClick={onStart}
                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-full bg-primary px-12 text-base font-medium text-primary-foreground transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 hover:ring-4 hover:ring-primary/20 active:scale-[0.98]"
              >
                <span className="relative z-10">Explore live debates</span>
                <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

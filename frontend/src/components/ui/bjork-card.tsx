"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const bjorkCardVariants = cva(
  "relative flex flex-col overflow-hidden rounded-[20px] border outline-none transition-[background-color,border-color,box-shadow,opacity,transform] duration-300",
  {
    variants: {
      variant: {
        surface:
          "border-[#CDD3D8] bg-[#FFFFFF] text-[#30343A] shadow-xs",
        elevated:
          "border-[#CDD3D8] bg-[#FFFFFF] text-[#30343A] shadow-xs",
        quiet:
          "border-[#CDD3D8] bg-[#F5F6F7] text-[#30343A]",
        interactive:
          "cursor-pointer border-[#CDD3D8] bg-[#FFFFFF] text-[#30343A] shadow-xs hover:border-[#AAB3BB] hover:bg-[#F9FAFB]",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
    },
    defaultVariants: {
      variant: "surface",
      padding: "md",
    },
  },
);

export interface BjorkCardProps
  extends Omit<HTMLMotionProps<"div">, "ref">,
    VariantProps<typeof bjorkCardVariants> {}

export function BjorkCard({
  className,
  variant,
  padding,
  ...props
}: BjorkCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const isInteractive = variant === "interactive" || props.role === "button";

  return (
    <motion.div
      data-slot="bjork-card"
      className={cn(bjorkCardVariants({ variant, padding, className }))}
      whileHover={isInteractive && !shouldReduceMotion ? { y: -2, scale: 1.005 } : undefined}
      whileTap={isInteractive && !shouldReduceMotion ? { scale: 0.995 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.8 }}
      {...props}
    />
  );
}

export function BjorkCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bjork-card-header"
      className={cn("flex items-start justify-between gap-4", className)}
      {...props}
    />
  );
}

export function BjorkCardTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="bjork-card-title"
      className={cn("text-base font-semibold leading-none tracking-[-0.02em] text-[#30343A]", className)}
      {...props}
    />
  );
}

export function BjorkCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="bjork-card-description"
      className={cn("text-sm leading-6 text-[#59616A]", className)}
      {...props}
    />
  );
}

export function BjorkCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bjork-card-content"
      className={cn("mt-5 text-[#30343A]", className)}
      {...props}
    />
  );
}

export function BjorkCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bjork-card-footer"
      className={cn("mt-5 flex items-center gap-3", className)}
      {...props}
    />
  );
}

export { bjorkCardVariants };

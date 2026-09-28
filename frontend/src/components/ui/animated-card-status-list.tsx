"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, Plus, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BjorkCard } from "@/components/ui/bjork-card";

export interface StatusCardItem {
  id: string | number;
  title: string;
  category?: string;
  status: "completed" | "learning" | "missing" | "not-started";
  actionLabel?: string;
}

export interface AnimatedCardStatusListProps {
  title?: string;
  subtitle?: string;
  cards: StatusCardItem[];
  onAction?: (cardId: string | number) => void;
  onAddCard?: () => void;
  onBack?: () => void;
  className?: string;
}

export function AnimatedCardStatusList({
  title = "Skill Gaps & Target Roadmap",
  subtitle,
  cards,
  onAction,
  onAddCard,
  onBack,
  className = "",
}: AnimatedCardStatusListProps) {
  const [hoveredCard, setHoveredCard] = useState<string | number | null>(null);
  const [activeDashIndex, setActiveDashIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  // Cycle through dash indices every 100ms for active indicator
  useEffect(() => {
    if (shouldReduceMotion) return;

    const interval = setInterval(() => {
      setActiveDashIndex((prev) => (prev + 1) % 8);
    }, 100);

    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const handleAction = (cardId: string | number) => {
    if (onAction) {
      onAction(cardId);
    }
  };

  const getStatusIcon = (status: StatusCardItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-[#3D7C63]" />;
      case "learning":
        return <Clock className="w-4 h-4 text-[#B07A32]" />;
      case "missing":
      case "not-started":
        return <AlertCircle className="w-4 h-4 text-[#B85C58]" />;
    }
  };

  const getStatusText = (status: StatusCardItem["status"]) => {
    switch (status) {
      case "completed":
        return "COMPLETED";
      case "learning":
        return "LEARNING";
      case "missing":
      case "not-started":
        return "NOT STARTED";
    }
  };

  const getStatusBadgeClass = (status: StatusCardItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[#EAF2ED] text-[#3D7C63] border-[#B8D7C8]";
      case "learning":
        return "bg-[#FBF2E7] text-[#B07A32] border-[#E9CDB0]";
      case "missing":
      case "not-started":
        return "bg-[#F9ECEB] text-[#B85C58] border-[#E4B8B6]";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <BjorkCard variant="elevated" padding="none" className="rounded-2xl border-[#CDD3D8] bg-[#FFFFFF] p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ECEFF1]">
          <div>
            <h2 className="text-base font-bold text-[#30343A] tracking-[-0.02em]">{title}</h2>
            {subtitle && <p className="text-xs text-[#59616A] mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2">
            {onBack && (
              <motion.button
                onClick={onBack}
                className="cursor-pointer rounded-lg border border-[#CDD3D8] bg-[#F5F6F7] p-1.5 text-[#30343A] hover:bg-[#ECEFF1]"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                aria-label="Go back"
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
            )}
            {onAddCard && (
              <motion.button
                onClick={onAddCard}
                className="cursor-pointer rounded-lg border border-[#CDD3D8] bg-[#F5F6F7] p-1.5 text-[#30343A] hover:bg-[#ECEFF1]"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                aria-label="Add item"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>

        {/* Cards list */}
        <motion.div
          className="space-y-2.5"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.05,
              },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {cards.map((card) => (
              <motion.div
                key={card.id}
                layout
                layoutId={String(card.id)}
                variants={{
                  hidden: { opacity: 0, y: 10, scale: 0.98 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      duration: shouldReduceMotion ? 0.2 : undefined,
                    },
                  },
                }}
                exit={{
                  opacity: 0,
                  y: -10,
                  scale: 0.98,
                  transition: {
                    duration: shouldReduceMotion ? 0.15 : 0.2,
                    ease: "easeInOut",
                  },
                }}
                className="relative cursor-pointer"
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <BjorkCard
                  variant="interactive"
                  padding="none"
                  className="relative rounded-xl border border-[#CDD3D8] bg-[#FFFFFF] p-3.5 hover:border-[#AAB3BB] hover:bg-[#F8F9FA] transition-colors shadow-2xs"
                >
                  <div className="relative flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Status Icon */}
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        {getStatusIcon(card.status)}
                      </div>

                      {/* Title & Category */}
                      <div className="min-w-0">
                        <span className="truncate block text-xs font-bold text-[#30343A]">
                          {card.title}
                        </span>
                        {card.category && (
                          <span className="text-[10px] font-mono text-[#7A838C]">
                            {card.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Badge or Action Button */}
                    <div className="flex items-center shrink-0">
                      {card.actionLabel && hoveredCard === card.id ? (
                        <motion.button
                          key="action-button"
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAction(card.id)}
                          className="cursor-pointer whitespace-nowrap rounded-md border border-[#CDD3D8] bg-[#ECEFF1] px-2.5 py-1 text-xs font-semibold text-[#30343A] hover:bg-[#DCE1E5]"
                        >
                          {card.actionLabel}
                        </motion.button>
                      ) : (
                        <span
                          className={cn(
                            "whitespace-nowrap font-mono text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border",
                            getStatusBadgeClass(card.status)
                          )}
                        >
                          {getStatusText(card.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </BjorkCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </BjorkCard>
    </div>
  );
}

export default AnimatedCardStatusList;

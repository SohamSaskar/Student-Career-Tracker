"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface CoverflowSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  meta?: { label: string; value: string }[];
}

export interface CoverflowCarouselProps {
  slides: CoverflowSlide[];
  /** Degrees the first neighbour tilts. */
  rotate?: number;
  /** How far the first neighbour recedes, as a fraction of card width. */
  depth?: number;
  /** Viewer distance as a multiple of card width — smaller is a wider lens. */
  perspective?: number;
  /** Exponent on distance. Below 1 the rake eases off as cards travel out. */
  falloff?: number;
  /** Opacity lost per step from the centre. */
  fade?: number;
  /** Any CSS length. Everything else is derived from it, so the rake scales. */
  cardWidth?: string;
  /** Space between cards, as a fraction of card width. */
  gap?: number;
  loop?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showCaption?: boolean;
  showPagination?: boolean;
  showNavigation?: boolean;
  /** Names the carousel for assistive tech. */
  label?: string;
  className?: string;
  cardClassName?: string;
}

export function CoverflowCarousel({
  slides,
  rotate = 40,
  depth = 0.55,
  perspective = 3,
  falloff = 0.56,
  fade = 0.15,
  cardWidth = "clamp(200px, 28vw, 320px)",
  gap = 0.08,
  loop = true,
  autoPlay = false,
  autoPlayInterval = 4000,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = "Cover carousel",
  className,
  cardClassName,
}: CoverflowCarouselProps) {
  const count = slides.length;

  const frameRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  /** Fractional card index at the centre. The single source of truth. */
  const posRef = React.useRef(0);
  /** Where the current settle is headed. */
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef<number | null>(null);
  const dragRef = React.useRef<{
    id: number;
    x: number;
    pos: number;
    v: number;
    t: number;
  } | null>(null);

  const [selected, setSelected] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  /** Nearest whole card, folded back into 0..count-1. */
  const indexAt = React.useCallback(
    (pos: number) => ((Math.round(pos) % count) + count) % count,
    [count],
  );

  // Paint straight to the DOM with smooth CSS transitions and non-active blur
  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge = loop ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance));

      // Blur non-active cards: active card is crisp (0px), side cards blur (3.5px)
      const isDragging = dragRef.current !== null;
      const blurPx = distance < 0.2 ? 0 : Math.min(6, Math.pow(distance, 0.9) * 3.5);
      
      card.style.filter = blurPx === 0 ? "none" : `blur(${blurPx.toFixed(1)}px)`;
      card.style.transition = isDragging
        ? "none"
        : "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease, filter 0.45s ease, box-shadow 0.3s ease";
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target: number) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.18;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint],
  );

  const clamp = React.useCallback(
    (pos: number) => (loop ? pos : Math.max(0, Math.min(count - 1, pos))),
    [count, loop],
  );

  const goTo = React.useCallback(
    (index: number) => {
      const target = loop
        ? index + Math.round((targetRef.current - index) / count) * count
        : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle],
  );

  const nudge = React.useCallback(
    (by: number) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - (event.clientX - drag.x) / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  // AutoPlay logic if enabled
  React.useEffect(() => {
    if (!autoPlay || isHovered) return;
    const timer = setInterval(() => {
      nudge(1);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, isHovered, nudge]);

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const active = slides[selected];

  return (
    <div
      className={cn("w-full", className)}
      style={{ ["--cf-card" as string]: cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-10 outline-none ring-ring focus-visible:ring-2 active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isActive = index === selected;
              return (
                <div
                  key={index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  onClick={() => goTo(index)}
                  onMouseEnter={() => {
                    if (index !== selected && !dragRef.current) {
                      goTo(index);
                    }
                  }}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl bg-slate-900 shadow-2xl cursor-pointer will-change-transform group transition-all duration-300",
                    isActive
                      ? "ring-4 ring-white/90 shadow-2xl scale-[1.02]"
                      : "hover:scale-105 hover:brightness-110 opacity-70",
                    cardClassName,
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className={cn(
                      "h-full w-full select-none object-cover transition-transform duration-500",
                      isActive ? "scale-100" : "scale-105 group-hover:scale-100"
                    )}
                  />

                  {/* Card Content Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-5 flex flex-col justify-end text-white">
                    {slide.title && (
                      <span className={cn(
                        "font-extrabold tracking-tight transition-all duration-300",
                        isActive ? "text-base text-white drop-shadow-md" : "text-sm text-slate-200"
                      )}>
                        {slide.title}
                      </span>
                    )}
                    {slide.subtitle && (
                      <span className="text-xs font-medium text-slate-300 opacity-90 mt-0.5">
                        {slide.subtitle}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="absolute left-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/90 text-white p-2.5 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="absolute right-4 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/60 hover:bg-black/90 text-white p-2.5 shadow-xl backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}
      </div>

      {/* Active Stage Details & Caption Showcase */}
      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-4 flex flex-col items-center px-6 duration-400 animate-in fade-in zoom-in-95"
        >
          <div className="text-center space-y-1">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-[#30343A] text-white uppercase tracking-wider mb-1">
              Active Stage {selected + 1} / {count}
            </span>
            <h3 className="text-xl font-extrabold tracking-tight text-[#30343A]">
              {active.title}
            </h3>
            {active.subtitle && (
              <p className="text-sm font-medium text-[#59616A]">
                {active.subtitle}
              </p>
            )}
          </div>

          {active.meta && active.meta.length > 0 && (
            <dl className="mt-5 w-full max-w-sm text-xs bg-white border border-[#CDD3D8] rounded-xl p-4 shadow-sm divide-y divide-slate-100">
              {active.meta.map((row) => (
                <div key={row.label} className="flex justify-between py-2">
                  <dt className="text-[#7A838C] font-semibold">{row.label}</dt>
                  <dd className="font-bold text-[#30343A] text-right">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {/* Dot Pagination */}
      {showPagination && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 cursor-pointer",
                index === selected
                  ? "w-8 bg-[#30343A] shadow-xs"
                  : "w-2.5 bg-[#CDD3D8] hover:bg-[#7A838C]"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

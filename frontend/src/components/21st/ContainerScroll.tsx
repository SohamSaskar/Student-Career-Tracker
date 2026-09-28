'use client';

import React, { useRef } from 'react';
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ContainerScrollProps {
  titleComponent?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContainerScroll({
  titleComponent,
  children,
  className,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.95, 1] : [1.02, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 0.4], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.4], scaleDimensions());
  const translateY = useTransform(scrollYProgress, [0, 0.4], [0, -20]);

  return (
    <div
      className={cn('h-[60rem] md:h-[70rem] flex items-center justify-center relative p-2 md:p-[20px]', className)}
      ref={containerRef}
    >
      <div
        className="py-10 md:py-20 w-full relative"
        style={{
          perspective: '1000px',
        }}
      >
        {titleComponent && <Header translateY={translateY} titleComponent={titleComponent} />}
        <Card rotate={rotate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({ translateY, titleComponent }: { translateY: MotionValue<number>; titleComponent: React.ReactNode }) {
  return (
    <motion.div
      style={{
        translateY,
      }}
      className="div max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          '0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(13, 27, 51, 0.05), 0 4px 6px -4px rgba(13, 27, 51, 0.03)',
      }}
      className="max-w-5xl -mt-12 mx-auto h-[32rem] md:h-[42rem] w-full border-2 border-dt-border p-2 md:p-6 bg-dt-elevated rounded-[30px] shadow-sm overflow-hidden"
    >
      <div className="h-full w-full overflow-y-auto rounded-2xl bg-dt-page/40 p-2 md:p-4">
        {children}
      </div>
    </motion.div>
  );
}

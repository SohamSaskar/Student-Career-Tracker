'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

const Timeline = React.forwardRef<HTMLOListElement, React.HTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol ref={ref} className={cn('flex flex-col', className)} {...props} />
  )
);
Timeline.displayName = 'Timeline';

interface TimelineItemProps extends Omit<HTMLMotionProps<'li'>, 'ref'> {
  date?: string | Date | number;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconColor?: 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive' | 'success' | 'warning';
  status?: 'completed' | 'in-progress' | 'pending' | 'error';
  iconsize?: 'sm' | 'md' | 'lg';
  showConnector?: boolean;
  error?: string;
}

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  (
    {
      className,
      date,
      title,
      description,
      icon,
      iconColor = 'primary',
      status = 'completed',
      iconsize = 'sm',
      showConnector = true,
      error,
      ...props
    },
    ref
  ) => {
    const commonClassName = cn('relative pb-6 last:pb-0 list-none', className);

    if (error) {
      return (
        <motion.li ref={ref} className={commonClassName} {...props}>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F9ECEB] border border-[#B85C58]">
                <AlertCircle className="h-4 w-4 text-[#B85C58]" />
              </div>
              {showConnector && <TimelineConnector status="pending" className="h-full" />}
            </div>

            <div className="flex flex-col gap-1 pl-2">
              <TimelineHeader>
                <TimelineTitle className="text-[#B85C58]">{title || 'Error'}</TimelineTitle>
              </TimelineHeader>
              <TimelineDescription className="text-[#B85C58]">{error}</TimelineDescription>
            </div>
          </div>
        </motion.li>
      );
    }

    return (
      <li ref={ref} className={commonClassName} {...(props as React.HTMLAttributes<HTMLLIElement>)}>
        <div className="flex gap-4 items-start">
          {/* Timeline dot and connector */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative z-10">
              <TimelineIcon icon={icon} color={iconColor} status={status} iconSize={iconsize} />
            </div>
            {showConnector && (
              <div className="w-0.5 bg-[#CDD3D8] flex-1 my-1.5 min-h-8" />
            )}
          </div>

          {/* Content */}
          <TimelineContent className="flex-1 pb-1">
            <div className="flex items-center justify-between gap-2">
              <TimelineTitle className="text-xs font-bold text-[#30343A]">{title}</TimelineTitle>
              {date !== undefined && <TimelineTime className="text-[10px] font-mono text-[#7A838C]" date={date} />}
            </div>
            {description && <TimelineDescription className="text-[11px] text-[#59616A] mt-0.5">{description}</TimelineDescription>}
          </TimelineContent>
        </div>
      </li>
    );
  }
);
TimelineItem.displayName = 'TimelineItem';

interface TimelineTimeProps extends React.HTMLAttributes<HTMLTimeElement> {
  date?: string | Date | number;
}

const TimelineTime = React.forwardRef<HTMLTimeElement, TimelineTimeProps>(
  ({ className, date, children, ...props }, ref) => {
    return (
      <time
        ref={ref}
        className={cn('text-xs font-mono font-medium text-[#7A838C]', className)}
        {...props}
      >
        {children || (date ? String(date) : '')}
      </time>
    );
  }
);
TimelineTime.displayName = 'TimelineTime';

const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    status?: 'completed' | 'in-progress' | 'pending';
    color?: 'primary' | 'secondary' | 'muted' | 'accent';
  }
>(({ className, status = 'completed', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'w-0.5',
      {
        'bg-[#30343A]': status === 'completed',
        'bg-[#CDD3D8]': status === 'pending',
        'bg-[#5B6470]': status === 'in-progress',
      },
      className
    )}
    {...props}
  />
));
TimelineConnector.displayName = 'TimelineConnector';

const TimelineHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props} />
  )
);
TimelineHeader.displayName = 'TimelineHeader';

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('font-semibold text-xs leading-none tracking-tight text-[#30343A]', className)}
    {...props}
  >
    {children}
  </h3>
));
TimelineTitle.displayName = 'TimelineTitle';

const TimelineIcon = ({
  icon,
  color = 'primary',
  iconSize = 'sm',
}: {
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive' | 'success' | 'warning';
  status?: 'completed' | 'in-progress' | 'pending' | 'error';
  iconSize?: 'sm' | 'md' | 'lg';
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const colorClasses = {
    primary: 'bg-[#30343A] text-white border-[#30343A]',
    secondary: 'bg-[#ECEFF1] text-[#30343A] border-[#CDD3D8]',
    muted: 'bg-[#F5F6F7] text-[#7A838C] border-[#CDD3D8]',
    accent: 'bg-[#5B6470] text-white border-[#5B6470]',
    destructive: 'bg-[#F9ECEB] text-[#B85C58] border-[#B85C58]',
    success: 'bg-[#EAF2ED] text-[#3D7C63] border-[#3D7C63]',
    warning: 'bg-[#FBF2E7] text-[#B07A32] border-[#B07A32]',
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full border shadow-2xs',
        sizeClasses[iconSize],
        colorClasses[color]
      )}
    >
      {icon ? (
        <div className={cn('flex items-center justify-center', iconSizeClasses[iconSize])}>
          {icon}
        </div>
      ) : (
        <div className={cn('rounded-full bg-current', iconSizeClasses[iconSize])} />
      )}
    </div>
  );
};

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-[#59616A]', className)} {...props} />
));
TimelineDescription.displayName = 'TimelineDescription';

const TimelineContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1', className)} {...props} />
  )
);
TimelineContent.displayName = 'TimelineContent';

const TimelineEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col items-center justify-center p-6 text-center text-xs text-[#7A838C]', className)}
      {...props}
    >
      {children || 'No timeline items to display'}
    </div>
  )
);
TimelineEmpty.displayName = 'TimelineEmpty';

export {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
  TimelineTime,
  TimelineEmpty,
};

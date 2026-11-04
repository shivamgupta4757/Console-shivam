import React from 'react';
import { motion } from 'motion/react';

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  reducedMotion?: boolean;
  as?: 'div' | 'article' | 'header' | 'footer';
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const FadeInUp: React.FC<FadeInUpProps> = ({
  children,
  className = '',
  delay = 0,
  distance = 22,
  duration = 0.65,
  reducedMotion = false,
  as = 'div',
}) => {
  const Component = motion[as];

  if (reducedMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14, margin: '0px 0px -40px 0px' }}
      transition={{
        duration,
        delay,
        ease: EASE_OUT_EXPO,
      }}
    >
      {children}
    </Component>
  );
};

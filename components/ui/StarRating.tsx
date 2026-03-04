'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function StarRating({ value = 0, onChange, readOnly = false, size = 'md', className }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const sizeClass = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' }[size];
  const active = hovered || value;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && onChange?.(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={cn(
            sizeClass,
            'transition-colors',
            readOnly ? 'cursor-default' : 'cursor-pointer',
          )}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill={star <= active ? '#E8A838' : 'none'} stroke={star <= active ? '#E8A838' : '#3A3A3A'} strokeWidth="1.5">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

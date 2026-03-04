import { cn } from '@/lib/utils/cn';

interface LoadingDotsProps {
  className?: string;
}

export default function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <span className={cn('inline-flex items-center gap-1', className)} aria-label="Loading">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#A09A90]"
          style={{ animation: `pulseDot 1.4s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </span>
  );
}

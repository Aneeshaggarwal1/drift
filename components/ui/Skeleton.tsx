import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-[#2A2A2A] rounded-lg animate-pulse',
        className,
      )}
      aria-hidden="true"
    />
  );
}

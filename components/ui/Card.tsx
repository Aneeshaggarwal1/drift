import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ hover = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4',
        hover && 'transition-colors cursor-pointer hover:bg-[#252525] hover:border-[#3A3A3A]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

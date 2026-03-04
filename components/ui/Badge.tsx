import { cn } from '@/lib/utils/cn';

type BadgeVariant = 'default' | 'amber' | 'sage' | 'error' | 'planned' | 'ongoing' | 'completed';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:   'bg-[#2A2A2A] text-[#A09A90]',
  amber:     'bg-[#E8A838]/10 text-[#E8A838]',
  sage:      'bg-[#7C9A6E]/10 text-[#7C9A6E]',
  error:     'bg-[#D4756B]/10 text-[#D4756B]',
  planned:   'bg-[#E8A838]/10 text-[#E8A838]',
  ongoing:   'bg-[#7C9A6E]/10 text-[#7C9A6E]',
  completed: 'bg-[#2A2A2A] text-[#A09A90]',
};

export default function Badge({ variant = 'default', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

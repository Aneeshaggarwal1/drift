import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors cursor-pointer',
        // variants
        variant === 'primary' && 'bg-[#E8A838] text-[#0F0F0F] hover:bg-[#d4972e] disabled:opacity-50',
        variant === 'secondary' && 'bg-[#1A1A1A] text-[#F5F0E8] border border-[#2A2A2A] hover:bg-[#252525] disabled:opacity-50',
        variant === 'ghost' && 'bg-transparent text-[#A09A90] hover:text-[#F5F0E8] hover:bg-[#1A1A1A] disabled:opacity-50',
        variant === 'danger' && 'bg-[#D4756B]/10 text-[#D4756B] border border-[#D4756B]/20 hover:bg-[#D4756B]/20 disabled:opacity-50',
        // sizes
        size === 'sm' && 'text-xs px-3 py-1.5 gap-1.5',
        size === 'md' && 'text-sm px-4 py-2 gap-2',
        size === 'lg' && 'text-base px-5 py-2.5 gap-2',
        (disabled || loading) && 'cursor-not-allowed',
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : children}
    </button>
  );
}

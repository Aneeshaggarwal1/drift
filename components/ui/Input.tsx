import { cn } from '@/lib/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs text-[#A09A90]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F0E8] placeholder:text-[#3A3A3A]',
          'focus:outline-none focus:border-[#E8A838] transition-colors',
          error && 'border-[#D4756B] focus:border-[#D4756B]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-[#D4756B]">{error}</span>}
    </div>
  );
}

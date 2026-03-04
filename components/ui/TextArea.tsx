import { cn } from '@/lib/utils/cn';
import { useRef, useEffect } from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  autoResize?: boolean;
}

export default function TextArea({ label, error, autoResize = false, className, id, onChange, ...props }: TextAreaProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (autoResize && ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
    onChange?.(e);
  }

  useEffect(() => {
    if (autoResize && ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  }, [autoResize, props.value]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs text-[#A09A90]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={3}
        className={cn(
          'bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 py-2.5 text-sm text-[#F5F0E8] placeholder:text-[#3A3A3A]',
          'focus:outline-none focus:border-[#E8A838] transition-colors resize-none',
          error && 'border-[#D4756B] focus:border-[#D4756B]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        )}
        onChange={handleChange}
        {...props}
      />
      {error && <span className="text-xs text-[#D4756B]">{error}</span>}
    </div>
  );
}

import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        <h1
          className="text-2xl font-semibold text-[#F5F0E8]"
          style={{ fontFamily: 'Fraunces, serif' }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-[#A09A90] text-sm mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

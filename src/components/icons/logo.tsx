import { Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  className,
  iconClassName,
  textClassName,
}: {
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Scale className={cn('size-8', iconClassName)} />
      <h1 className={cn('text-2xl font-bold font-headline', textClassName)}>
        Lexica
      </h1>
    </div>
  );
}

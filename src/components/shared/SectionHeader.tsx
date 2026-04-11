import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-righteous">{title}</h2>
      {description && <p className="mt-1 text-gray-500 dark:text-gray-400">{description}</p>}
    </div>
  );
}

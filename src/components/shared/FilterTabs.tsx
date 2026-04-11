import { cn } from '@/lib/utils';

export interface Tab {
  value: string;
  label: string;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterTabs({ tabs, activeTab, onChange, className }: FilterTabsProps) {
  return (
    <div className={cn('flex gap-1 p-1 bg-crema dark:bg-gray-800 rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.value
              ? 'bg-gold text-white shadow-sm'
              : 'text-gray-600 hover:text-gold dark:text-gray-300 dark:hover:text-gold'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

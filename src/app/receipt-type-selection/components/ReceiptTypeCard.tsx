'use client';

import Icon from '@/components/ui/AppIcon';

interface ReceiptTypeCardProps {
  type: 'physiotherapy' | 'pilates';
  title: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function ReceiptTypeCard({
  type,
  title,
  description,
  icon,
  isSelected,
  onClick
}: ReceiptTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border-2 therapeutic-transition text-left ${
        isSelected
          ? 'border-brand-primary bg-gradient-to-br from-blue-50 to-cyan-50 shadow-clinical-md'
          : 'border-border bg-card hover:border-brand-primary/50 hover:shadow-clinical'
      }`}
      aria-pressed={isSelected}
      aria-label={`Select ${title} receipt type`}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-lg therapeutic-transition ${
            isSelected
              ? 'bg-brand-primary text-white shadow-clinical'
              : 'bg-gradient-bg text-brand-primary'
          }`}
        >
          <Icon name={icon as any} size={28} variant={isSelected ? 'solid' : 'outline'} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">
            {title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
        </div>
        <div
          className={`flex items-center justify-center w-6 h-6 rounded-full border-2 therapeutic-transition ${
            isSelected
              ? 'border-brand-primary bg-brand-primary' :'border-border bg-white'
          }`}
        >
          {isSelected && (
            <Icon name="CheckIcon" size={14} variant="solid" className="text-white" />
          )}
        </div>
      </div>
    </button>
  );
}
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface QuickActionProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  bgColor: string;
  iconColor: string;
}

const QuickActionCard = ({ title, description, icon, href, bgColor, iconColor }: QuickActionProps) => {
  return (
    <Link 
      href={href}
      className="group bg-card rounded-xl p-6 shadow-clinical border border-border therapeutic-transition hover:shadow-clinical-md hover:border-brand-primary"
    >
      <div className="flex items-start space-x-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${bgColor} group-hover:scale-110 therapeutic-transition`}>
          <Icon name={icon as any} size={24} variant="solid" className={iconColor} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-1 group-hover:text-brand-primary therapeutic-transition">
            {title}
          </h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <Icon 
          name="ChevronRightIcon" 
          size={20} 
          variant="outline" 
          className="text-text-secondary group-hover:text-brand-primary group-hover:translate-x-1 therapeutic-transition"
        />
      </div>
    </Link>
  );
};

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Receipt',
      description: 'Create physiotherapy or Pilates receipt',
      icon: 'PlusCircleIcon',
      href: '/receipt-type-selection',
      bgColor: 'bg-brand-primary',
      iconColor: 'text-white'
    },
    {
      title: 'View All Receipts',
      description: 'Browse and manage existing receipts',
      icon: 'DocumentTextIcon',
      href: '/receipt-listing-screen',
      bgColor: 'bg-secondary',
      iconColor: 'text-white'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-text-primary">Quick Actions</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
import Icon from '@/components/ui/AppIcon';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
  bgColor: string;
}

const StatCard = ({ title, value, icon, trend, trendUp, bgColor }: StatCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-clinical border border-border therapeutic-transition hover:shadow-clinical-md">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary mb-1">{title}</p>
          <h3 className="text-3xl font-heading font-bold text-text-primary mb-2">{value}</h3>
          {/* {trend && (
            <div className="flex items-center space-x-1">
              <Icon 
                name={trendUp ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'} 
                size={16} 
                variant="solid"
                className={trendUp ? 'text-success' : 'text-error'}
              />
              <span className={`text-xs font-medium ${trendUp ? 'text-success' : 'text-error'}`}>
                {trend}
              </span>
              <span className="text-xs text-text-secondary">vs last month</span>
            </div>
          )} */}
        </div>
        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${bgColor}`}>
          <Icon name={icon as any} size={24} variant="solid" className="text-white" />
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  stats: {
    todayReceipts: number;
    todayAmount: string;
    monthReceipts: number;
    monthAmount: string;
    pendingPayments: number;
    totalClients: number;
  };
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Today's Receipts"
        value={stats.todayReceipts}
        icon="DocumentTextIcon"
        trend="+12%"
        trendUp={true}
        bgColor="bg-brand-primary"
      />
      <StatCard
        title="Today's Revenue"
        value={stats.todayAmount}
        icon="CurrencyRupeeIcon"
        trend="+8%"
        trendUp={true}
        bgColor="bg-secondary"
      />
      <StatCard
        title="This Month"
        value={stats.monthReceipts}
        icon="ChartBarIcon"
        bgColor="bg-brand-action"
      />
      <StatCard
        title="Monthly Revenue"
        value={stats.monthAmount}
        icon="BanknotesIcon"
        bgColor="bg-success"
      />
    </div>
  );
};

export default DashboardStats;

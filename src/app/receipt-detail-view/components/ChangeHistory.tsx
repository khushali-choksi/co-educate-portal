import Icon from '@/components/ui/AppIcon';

interface HistoryEntry {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
}

interface ChangeHistoryProps {
  history: HistoryEntry[];
}

const ChangeHistory = ({ history }: ChangeHistoryProps) => {
  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'PlusCircleIcon';
      case 'edited':
        return 'PencilIcon';
      case 'downloaded':
        return 'ArrowDownTrayIcon';
      case 'shared':
        return 'ShareIcon';
      default:
        return 'ClockIcon';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'created':
        return 'text-success';
      case 'edited':
        return 'text-warning';
      case 'downloaded':
        return 'text-brand-action';
      case 'shared':
        return 'text-brand-secondary';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 clinical-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
          <Icon name="ClockIcon" size={20} variant="solid" className="text-warning" />
        </div>
        <h2 className="text-lg font-heading font-semibold text-text-primary">
          Change History
        </h2>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="InformationCircleIcon" size={48} variant="outline" className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-text-secondary">No change history available</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            
            {history.map((entry, index) => (
              <div key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-card border-2 border-border ${getActionColor(entry.action)}`}>
                  <Icon name={getActionIcon(entry.action) as any} size={16} variant="solid" />
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-medium text-text-primary">{entry.action}</p>
                    <p className="text-xs text-text-secondary whitespace-nowrap">{entry.timestamp}</p>
                  </div>
                  <p className="text-xs text-text-secondary mb-1">by {entry.user}</p>
                  <p className="text-sm text-text-primary">{entry.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeHistory;
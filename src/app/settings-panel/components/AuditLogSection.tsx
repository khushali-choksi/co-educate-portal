'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

const AuditLogSection = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      action: 'Password Changed',
      user: 'Dr. Khushali Choksi',
      timestamp: '21/01/2026 09:15 AM',
      details: 'User password was successfully updated',
      type: 'success',
    },
    {
      id: '2',
      action: 'Practice Info Updated',
      user: 'Dr. Khushali Choksi',
      timestamp: '20/01/2026 02:30 PM',
      details: 'Practice address and contact information modified',
      type: 'info',
    },
    {
      id: '3',
      action: 'Backup Created',
      user: 'System',
      timestamp: '20/01/2026 12:00 AM',
      details: 'Automatic daily backup completed successfully',
      type: 'success',
    },
    {
      id: '4',
      action: 'Receipt Configuration Changed',
      user: 'Dr. Khushali Choksi',
      timestamp: '19/01/2026 04:45 PM',
      details: 'Receipt numbering prefix updated from "RC" to "CE"',
      type: 'info',
    },
    {
      id: '5',
      action: 'Failed Login Attempt',
      user: 'Unknown',
      timestamp: '19/01/2026 11:20 AM',
      details: 'Multiple failed login attempts detected',
      type: 'warning',
    },
  ]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl shadow-clinical-md border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
            <div>
              <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const getTypeStyles = (type: AuditLog['type']) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'error':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-brand-primary/10 text-brand-primary border-brand-primary/20';
    }
  };

  const getTypeIcon = (type: AuditLog['type']) => {
    switch (type) {
      case 'success':
        return 'CheckCircleIcon';
      case 'warning':
        return 'ExclamationTriangleIcon';
      case 'error':
        return 'XCircleIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  return (
    <div className="bg-card rounded-xl shadow-clinical-md border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-secondary/10">
            <Icon name="ClipboardDocumentListIcon" size={20} className="text-brand-secondary" variant="solid" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Audit Log</h2>
            <p className="text-sm text-text-secondary">View system activity and changes</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-muted text-text-primary rounded-lg hover:bg-muted/80 therapeutic-transition">
          <Icon name="ArrowDownTrayIcon" size={18} variant="outline" />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-gradient-bg border border-border rounded-lg p-4 hover:shadow-clinical therapeutic-transition"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg border ${getTypeStyles(log.type)}`}>
                  <Icon name={getTypeIcon(log.type) as any} size={18} variant="solid" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-text-primary">{log.action}</h3>
                  <p className="text-xs text-text-secondary mt-0.5">{log.details}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center space-x-2">
                <Icon name="UserIcon" size={14} className="text-text-secondary" variant="outline" />
                <span className="text-xs text-text-secondary">{log.user}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="ClockIcon" size={14} className="text-text-secondary" variant="outline" />
                <span className="text-xs text-text-secondary">{log.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditLogSection;
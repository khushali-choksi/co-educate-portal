'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: string;
  lastBackup: string;
}

interface BackupSectionProps {
  onBackup: () => void;
  onRestore: () => void;
}

const BackupSection = ({ onBackup, onRestore }: BackupSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [settings, setSettings] = useState<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    lastBackup: '21/01/2026 08:30 AM',
  });
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

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
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleBackup = () => {
    onBackup();
  };

  const handleRestore = () => {
    setShowRestoreConfirm(false);
    onRestore();
  };

  return (
    <div className="bg-card rounded-xl shadow-clinical-md border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-action/10">
            <Icon name="CloudArrowUpIcon" size={20} className="text-brand-action" variant="solid" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Backup & Restore</h2>
            <p className="text-sm text-text-secondary">Manage data backup and recovery</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-bg border border-border rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10 mt-0.5">
                <Icon name="ClockIcon" size={18} className="text-success" variant="outline" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-1">Automatic Backup</h3>
                <p className="text-xs text-text-secondary">Schedule regular data backups</p>
              </div>
            </div>
            <button
              onClick={() => setSettings(prev => ({ ...prev, autoBackup: !prev.autoBackup }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full therapeutic-transition ${
                settings.autoBackup ? 'bg-success' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white therapeutic-transition ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {settings.autoBackup && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Backup Frequency</label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="CheckCircleIcon" size={20} className="text-success" variant="solid" />
              <div>
                <p className="text-sm font-medium text-text-primary">Last Backup</p>
                <p className="text-xs text-text-secondary">{settings.lastBackup}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-xs font-medium">
              Completed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleBackup}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-brand-action text-brand-action-foreground rounded-lg hover:bg-brand-action/90 therapeutic-transition"
          >
            <Icon name="CloudArrowUpIcon" size={20} variant="outline" />
            <span className="font-medium">Create Backup</span>
          </button>

          <button
            onClick={() => setShowRestoreConfirm(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 therapeutic-transition"
          >
            <Icon name="CloudArrowDownIcon" size={20} variant="outline" />
            <span className="font-medium">Restore Data</span>
          </button>
        </div>

        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="ExclamationTriangleIcon" size={20} className="text-error mt-0.5" variant="solid" />
            <div>
              <h3 className="text-sm font-medium text-text-primary mb-1">Important Notice</h3>
              <p className="text-xs text-text-secondary">
                Restoring data will replace all current information with the backup. This action cannot be undone. Please ensure you have a recent backup before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-clinical-lg border border-border max-w-md w-full p-6">
            <div className="flex items-start space-x-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10">
                <Icon name="ExclamationTriangleIcon" size={24} className="text-warning" variant="solid" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-1">Confirm Restore</h3>
                <p className="text-sm text-text-secondary">
                  Are you sure you want to restore data from backup? This will replace all current information.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowRestoreConfirm(false)}
                className="px-6 py-2.5 bg-muted text-text-primary rounded-lg hover:bg-muted/80 therapeutic-transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRestore}
                className="px-6 py-2.5 bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 therapeutic-transition"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupSection;
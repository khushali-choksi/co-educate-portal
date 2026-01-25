'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  sessionTimeout: string;
  twoFactorEnabled: boolean;
}

interface SecuritySectionProps {
  onSave: (data: SecuritySettings) => void;
}

const SecuritySection = ({ onSave }: SecuritySectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [formData, setFormData] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    sessionTimeout: '30',
    twoFactorEnabled: false,
  });
  const [passwordError, setPasswordError] = useState('');

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
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof SecuritySettings, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'newPassword' || field === 'confirmPassword') {
      setPasswordError('');
    }
  };

  const handleSave = () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (formData.currentPassword !== '123123') {
      setPasswordError('Current password is incorrect');
      return;
    }

    onSave(formData);
    setIsEditing(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPasswordError('');
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }));
  };

  return (
    <div className="bg-card rounded-xl shadow-clinical-md border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-error/10">
            <Icon name="ShieldCheckIcon" size={20} className="text-error" variant="solid" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Security Settings</h2>
            <p className="text-sm text-text-secondary">Manage authentication and security preferences</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 therapeutic-transition"
          >
            <Icon name="PencilIcon" size={18} variant="outline" />
            <span className="text-sm font-medium">Edit</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {isEditing && (
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-3">
              <Icon name="ExclamationTriangleIcon" size={20} className="text-warning mt-0.5" variant="solid" />
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-1">Change Password</h3>
                <p className="text-xs text-text-secondary">Current password: 123123</p>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="space-y-4 pb-4 border-b border-border">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-2.5 pr-12 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary therapeutic-transition"
                >
                  <Icon name={showPasswords ? 'EyeSlashIcon' : 'EyeIcon'} size={20} variant="outline" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Confirm New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                placeholder="Confirm new password"
              />
            </div>

            {passwordError && (
              <div className="bg-error/10 border border-error/20 rounded-lg p-3">
                <p className="text-sm text-error">{passwordError}</p>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Session Timeout (minutes)</label>
          {isEditing ? (
            <select
              value={formData.sessionTimeout}
              onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          ) : (
            <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.sessionTimeout} minutes</div>
          )}
        </div>

        <div className="bg-gradient-bg border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-success/10 mt-0.5">
                <Icon name="LockClosedIcon" size={18} className="text-success" variant="solid" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-1">Two-Factor Authentication</h3>
                <p className="text-xs text-text-secondary">Add an extra layer of security to your account</p>
              </div>
            </div>
            {isEditing ? (
              <button
                onClick={() => handleInputChange('twoFactorEnabled', !formData.twoFactorEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full therapeutic-transition ${
                  formData.twoFactorEnabled ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white therapeutic-transition ${
                    formData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                formData.twoFactorEnabled 
                  ? 'bg-success/10 text-success' :'bg-muted text-text-secondary'
              }`}>
                {formData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-muted text-text-primary rounded-lg hover:bg-muted/80 therapeutic-transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-success text-success-foreground rounded-lg hover:bg-success/90 therapeutic-transition flex items-center space-x-2"
            >
              <Icon name="CheckIcon" size={18} variant="outline" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySection;
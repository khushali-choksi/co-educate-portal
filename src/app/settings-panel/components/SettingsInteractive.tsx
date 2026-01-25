'use client';

import { useState } from 'react';
import PracticeInfoSection from './PracticeInfoSection';
import ReceiptConfigSection from './ReceiptConfigSection';
import LanguagePreferencesSection from './LanguagePreferencesSection';
import SecuritySection from './SecuritySection';
import BackupSection from './BackupSection';
import AuditLogSection from './AuditLogSection';
import Icon from '@/components/ui/AppIcon';

interface PracticeInfo {
  practiceName: string;
  doctorName: string;
  credentials: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  registrationNumber: string;
}

interface ReceiptConfig {
  receiptPrefix: string;
  startingNumber: string;
  dateFormat: string;
  currencyFormat: string;
  taxEnabled: boolean;
  taxPercentage: string;
}

interface LanguagePreferences {
  primaryLanguage: string;
  secondaryLanguage: string;
  clientFacingLanguage: string;
  autoTranslate: boolean;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  sessionTimeout: string;
  twoFactorEnabled: boolean;
}

const SettingsInteractive = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationType('success');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const showErrorNotification = (message: string) => {
    setNotificationMessage(message);
    setNotificationType('error');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handlePracticeInfoSave = (data: PracticeInfo) => {
    showSuccessNotification('Practice information updated successfully');
  };

  const handleReceiptConfigSave = (data: ReceiptConfig) => {
    showSuccessNotification('Receipt configuration updated successfully');
  };

  const handleLanguagePreferencesSave = (data: LanguagePreferences) => {
    showSuccessNotification('Language preferences updated successfully');
  };

  const handleSecuritySave = (data: SecuritySettings) => {
    showSuccessNotification('Security settings updated successfully');
  };

  const handleBackup = () => {
    showSuccessNotification('Backup created successfully');
  };

  const handleRestore = () => {
    showSuccessNotification('Data restored successfully');
  };

  return (
    <>
      <div className="space-y-6">
        <PracticeInfoSection onSave={handlePracticeInfoSave} />
        <ReceiptConfigSection onSave={handleReceiptConfigSave} />
        <LanguagePreferencesSection onSave={handleLanguagePreferencesSave} />
        <SecuritySection onSave={handleSecuritySave} />
        <BackupSection onBackup={handleBackup} onRestore={handleRestore} />
        <AuditLogSection />
      </div>

      {showNotification && (
        <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-clinical-lg border ${
            notificationType === 'success' ?'bg-success text-success-foreground border-success' :'bg-error text-error-foreground border-error'
          }`}>
            <Icon 
              name={notificationType === 'success' ? 'CheckCircleIcon' : 'XCircleIcon'} 
              size={24} 
              variant="solid" 
            />
            <span className="font-medium">{notificationMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsInteractive;
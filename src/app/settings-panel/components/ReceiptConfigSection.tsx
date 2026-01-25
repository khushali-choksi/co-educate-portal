'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ReceiptConfig {
  receiptPrefix: string;
  startingNumber: string;
  dateFormat: string;
  currencyFormat: string;
  taxEnabled: boolean;
  taxPercentage: string;
}

interface ReceiptConfigSectionProps {
  onSave: (data: ReceiptConfig) => void;
}

const ReceiptConfigSection = ({ onSave }: ReceiptConfigSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ReceiptConfig>({
    receiptPrefix: 'CE',
    startingNumber: '1001',
    dateFormat: 'DD/MM/YYYY',
    currencyFormat: '₹ 1,00,000',
    taxEnabled: false,
    taxPercentage: '18',
  });

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

  const handleInputChange = (field: keyof ReceiptConfig, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-xl shadow-clinical-md border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
            <Icon name="DocumentTextIcon" size={20} className="text-secondary" variant="solid" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Receipt Configuration</h2>
            <p className="text-sm text-text-secondary">Configure receipt numbering and formatting</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Receipt Prefix</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.receiptPrefix}
                onChange={(e) => handleInputChange('receiptPrefix', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                placeholder="CE"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.receiptPrefix}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Starting Number</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.startingNumber}
                onChange={(e) => handleInputChange('startingNumber', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                placeholder="1001"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.startingNumber}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Date Format</label>
            {isEditing ? (
              <select
                value={formData.dateFormat}
                onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.dateFormat}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Currency Format</label>
            {isEditing ? (
              <select
                value={formData.currencyFormat}
                onChange={(e) => handleInputChange('currencyFormat', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              >
                <option value="₹ 1,00,000">₹ 1,00,000 (Indian)</option>
                <option value="₹ 100,000">₹ 100,000 (International)</option>
              </select>
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.currencyFormat}</div>
            )}
          </div>
        </div>

        <div className="bg-gradient-bg border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-warning/10 mt-0.5">
                <Icon name="CalculatorIcon" size={18} className="text-warning" variant="outline" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-1">Tax Configuration</h3>
                <p className="text-xs text-text-secondary">Enable tax calculation on receipts</p>
              </div>
            </div>
            {isEditing ? (
              <button
                onClick={() => handleInputChange('taxEnabled', !formData.taxEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full therapeutic-transition ${
                  formData.taxEnabled ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white therapeutic-transition ${
                    formData.taxEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                formData.taxEnabled 
                  ? 'bg-success/10 text-success' :'bg-muted text-text-secondary'
              }`}>
                {formData.taxEnabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>

          {formData.taxEnabled && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-2">Tax Percentage (%)</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.taxPercentage}
                  onChange={(e) => handleInputChange('taxPercentage', e.target.value)}
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
                  placeholder="18"
                />
              ) : (
                <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.taxPercentage}%</div>
              )}
            </div>
          )}
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

export default ReceiptConfigSection;
'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface LanguagePreferences {
  primaryLanguage: string;
  secondaryLanguage: string;
  clientFacingLanguage: string;
  autoTranslate: boolean;
}

interface LanguagePreferencesSectionProps {
  onSave: (data: LanguagePreferences) => void;
}

const LanguagePreferencesSection = ({ onSave }: LanguagePreferencesSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<LanguagePreferences>({
    primaryLanguage: 'English',
    secondaryLanguage: 'Gujarati',
    clientFacingLanguage: 'English',
    autoTranslate: false,
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
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof LanguagePreferences, value: string | boolean) => {
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
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
            <Icon name="LanguageIcon" size={20} className="text-accent" variant="solid" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Language Preferences</h2>
            <p className="text-sm text-text-secondary">Configure multilingual support settings</p>
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
            <label className="block text-sm font-medium text-text-primary mb-2">Primary Language</label>
            {isEditing ? (
              <select
                value={formData.primaryLanguage}
                onChange={(e) => handleInputChange('primaryLanguage', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              >
                <option value="English">English</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Hindi">Hindi</option>
              </select>
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.primaryLanguage}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Secondary Language</label>
            {isEditing ? (
              <select
                value={formData.secondaryLanguage}
                onChange={(e) => handleInputChange('secondaryLanguage', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              >
                <option value="Gujarati">Gujarati</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
              </select>
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.secondaryLanguage}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Client-Facing Language</label>
            {isEditing ? (
              <select
                value={formData.clientFacingLanguage}
                onChange={(e) => handleInputChange('clientFacingLanguage', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              >
                <option value="English">English</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Hindi">Hindi</option>
              </select>
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.clientFacingLanguage}</div>
            )}
          </div>
        </div>

        <div className="bg-gradient-bg border border-border rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-primary/10 mt-0.5">
                <Icon name="ArrowsRightLeftIcon" size={18} className="text-brand-primary" variant="outline" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text-primary mb-1">Auto-Translate</h3>
                <p className="text-xs text-text-secondary">Automatically translate client communications</p>
              </div>
            </div>
            {isEditing ? (
              <button
                onClick={() => handleInputChange('autoTranslate', !formData.autoTranslate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full therapeutic-transition ${
                  formData.autoTranslate ? 'bg-success' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white therapeutic-transition ${
                    formData.autoTranslate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            ) : (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                formData.autoTranslate 
                  ? 'bg-success/10 text-success' :'bg-muted text-text-secondary'
              }`}>
                {formData.autoTranslate ? 'Enabled' : 'Disabled'}
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

export default LanguagePreferencesSection;
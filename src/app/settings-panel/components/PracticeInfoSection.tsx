'use client';

import { useState, useEffect } from 'react';
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

interface PracticeInfoSectionProps {
  onSave: (data: PracticeInfo) => void;
}

const PracticeInfoSection = ({ onSave }: PracticeInfoSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PracticeInfo>({
    practiceName: 'CORE EDUCATE',
    doctorName: 'Dr. Khushali Choksi',
    credentials: 'BPT, MPT (Orthopedics)',
    address: '301, Shivalik Shilp, Iscon Cross Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380015',
    phone: '+91 98765 43210',
    email: 'info@coreeducate.com',
    registrationNumber: 'GJ/PHYSIO/2018/12345',
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl shadow-clinical-md border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary/10">
              <div className="w-5 h-5 bg-brand-primary/20 rounded animate-pulse" />
            </div>
            <div>
              <div className="h-6 w-40 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-56 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const handleInputChange = (field: keyof PracticeInfo, value: string) => {
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
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary/10">
            <Icon name="BuildingOfficeIcon" size={20} className="text-brand-primary" variant="solid" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Practice Information</h2>
            <p className="text-sm text-text-secondary">Manage your practice details and credentials</p>
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
            <label className="block text-sm font-medium text-text-primary mb-2">Practice Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.practiceName}
                onChange={(e) => handleInputChange('practiceName', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.practiceName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Doctor Name</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => handleInputChange('doctorName', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.doctorName}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Credentials</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.credentials}
                onChange={(e) => handleInputChange('credentials', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.credentials}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Registration Number</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.registrationNumber}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Address</label>
          {isEditing ? (
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
            />
          ) : (
            <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.address}</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">City</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.city}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">State</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.state}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Pincode</label>
            {isEditing ? (
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.pincode}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.phone}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-ring therapeutic-transition"
              />
            ) : (
              <div className="px-4 py-2.5 bg-muted rounded-lg text-text-primary">{formData.email}</div>
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

export default PracticeInfoSection;
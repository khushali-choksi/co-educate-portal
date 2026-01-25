'use client';

import Icon from '@/components/ui/AppIcon';

interface ClientInformationSectionProps {
  formData: {
    clientName: string;
    email: string;
    phone: string;
    address: string;
  };
  errors: {
    clientName?: string;
    email?: string;
    phone?: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

const ClientInformationSection = ({ formData, errors, onFieldChange }: ClientInformationSectionProps) => {
  return (
    <div className="bg-gradient-bg rounded-lg p-6 border border-border">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-action">
          <Icon name="UserIcon" size={20} variant="outline" className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-semibold text-text-primary">Client Information</h2>
          <p className="text-xs text-text-secondary">Enter client details for receipt generation</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-text-primary mb-2">
            Client Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              id="clientName"
              value={formData.clientName}
              onChange={(e) => onFieldChange('clientName', e.target.value)}
              placeholder="Enter full name"
              required
              className={`w-full px-4 py-3 pr-10 bg-surface border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.clientName ? 'border-destructive' : 'border-border'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Icon name="UserCircleIcon" size={20} variant="outline" className="text-text-secondary" />
            </div>
          </div>
          {errors.clientName && (
            <p className="mt-1 text-xs text-destructive flex items-center space-x-1">
              <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
              <span>{errors.clientName}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
              Email Address <span className="text-text-secondary text-xs">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => onFieldChange('email', e.target.value)}
                placeholder="client@example.com"
                className={`w-full px-4 py-3 pr-10 bg-surface border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? 'border-destructive' : 'border-border'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="EnvelopeIcon" size={20} variant="outline" className="text-text-secondary" />
              </div>
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => onFieldChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
                required
                pattern="[0-9+\s-]+"
                className={`w-full px-4 py-3 pr-10 bg-surface border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.phone ? 'border-destructive' : 'border-border'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <Icon name="PhoneIcon" size={20} variant="outline" className="text-text-secondary" />
              </div>
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-destructive flex items-center space-x-1">
                <Icon name="ExclamationCircleIcon" size={14} variant="solid" />
                <span>{errors.phone}</span>
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-2">
            Address
          </label>
          <div className="relative">
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              className="w-full px-4 py-3 pr-10 bg-surface border border-border rounded-lg text-text-primary therapeutic-transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <div className="absolute right-3 top-3 pointer-events-none">
              <Icon name="MapPinIcon" size={20} variant="outline" className="text-text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInformationSection;
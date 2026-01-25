'use client';

import { useState, useEffect } from 'react';

interface ClientInfoSectionProps {
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
    address?: string;
  };
  onFieldChange: (field: string, value: string) => void;
}

export default function ClientInfoSection({ formData, errors, onFieldChange }: ClientInfoSectionProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 lg:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary/10">
            <div className="w-5 h-5 bg-brand-primary/20 rounded"></div>
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-text-primary">Client Information</h2>
            <p className="text-sm text-text-secondary">Enter patient details for receipt generation</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
          <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
          <div className="h-32 bg-muted/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 lg:p-8 clinical-shadow">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand-primary/10">
          <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-heading font-semibold text-text-primary">Client Information</h2>
          <p className="text-sm text-text-secondary">Enter patient details for receipt generation</p>
        </div>
      </div>

      <fieldset className="space-y-6">
        <legend className="sr-only">Client Personal Information</legend>

        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-text-primary mb-2">
            Full Name <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            id="clientName"
            value={formData.clientName}
            onChange={(e) => onFieldChange('clientName', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.clientName ? 'border-destructive' : 'border-input'
            } bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
            placeholder="Enter client's full name"
            required
            aria-invalid={!!errors.clientName}
            aria-describedby={errors.clientName ? 'clientName-error' : undefined}
          />
          {errors.clientName && (
            <p id="clientName-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.clientName}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
            Email Address <span className="text-text-secondary text-xs">(Optional)</span>
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? 'border-destructive' : 'border-input'
            } bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
            placeholder="client@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.email}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-text-primary mb-2">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary">+91</span>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              className={`w-full pl-14 pr-4 py-3 rounded-lg border ${
                errors.phone ? 'border-destructive' : 'border-input'
              } bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition`}
              placeholder="9876543210"
              required
              maxLength={10}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
            />
          </div>
          {errors.phone && (
            <p id="phone-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-text-primary mb-2">
            Address <span className="text-destructive">*</span>
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={(e) => onFieldChange('address', e.target.value)}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.address ? 'border-destructive' : 'border-input'
            } bg-background text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent therapeutic-transition resize-none`}
            placeholder="Enter complete address with city and pincode"
            required
            aria-invalid={!!errors.address}
            aria-describedby={errors.address ? 'address-error' : undefined}
          />
          {errors.address && (
            <p id="address-error" className="mt-2 text-sm text-destructive flex items-center space-x-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errors.address}</span>
            </p>
          )}
        </div>
      </fieldset>
    </div>
  );
}
'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface MembershipType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface MembershipTypeSelectorProps {
  selectedType: string;
  onTypeChange: (typeId: string) => void;
}

const MembershipTypeSelector = ({ selectedType, onTypeChange }: MembershipTypeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const membershipTypes: MembershipType[] = [
    {
      id: 'individual',
      name: 'Individual Sessions',
      description: 'Pay-per-session model for flexible scheduling',
      icon: 'UserIcon'
    },
    {
      id: 'monthly',
      name: 'Monthly Membership',
      description: 'Unlimited sessions for 30 days',
      icon: 'CalendarIcon'
    },
    {
      id: 'quarterly',
      name: 'Quarterly Package',
      description: '3-month commitment with discounted rates',
      icon: 'ChartBarIcon'
    },
    {
      id: 'annual',
      name: 'Annual Membership',
      description: 'Best value - 12 months of wellness',
      icon: 'StarIcon'
    }
  ];

  const selectedMembership = membershipTypes.find(type => type.id === selectedType);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-text-primary mb-2">
        Membership Type <span className="text-destructive">*</span>
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-lg text-left therapeutic-transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      >
        <div className="flex items-center space-x-3">
          {selectedMembership ? (
            <>
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-to-br from-brand-primary to-brand-action">
                <Icon name={selectedMembership.icon as any} size={18} variant="outline" className="text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-text-primary">{selectedMembership.name}</div>
                <div className="text-xs text-text-secondary">{selectedMembership.description}</div>
              </div>
            </>
          ) : (
            <span className="text-text-secondary">Select membership type</span>
          )}
        </div>
        <Icon 
          name={isOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
          size={20} 
          variant="outline" 
          className="text-text-secondary"
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 w-full mt-2 bg-card rounded-lg shadow-clinical-lg border border-border overflow-hidden">
            {membershipTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  onTypeChange(type.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 therapeutic-transition ${
                  selectedType === type.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-text-primary'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-md ${
                  selectedType === type.id
                    ? 'bg-white/20' :'bg-gradient-to-br from-brand-primary to-brand-action'
                }`}>
                  <Icon 
                    name={type.icon as any} 
                    size={18} 
                    variant="outline" 
                    className={selectedType === type.id ? 'text-white' : 'text-white'}
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{type.name}</div>
                  <div className={`text-xs ${
                    selectedType === type.id ? 'text-primary-foreground/80' : 'text-text-secondary'
                  }`}>
                    {type.description}
                  </div>
                </div>
                {selectedType === type.id && (
                  <Icon name="CheckIcon" size={20} variant="solid" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MembershipTypeSelector;
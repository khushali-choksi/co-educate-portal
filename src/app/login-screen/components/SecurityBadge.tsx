import React from 'react';
import Icon from '@/components/ui/AppIcon';

const SecurityBadge = () => {
  return (
    <div className="mt-8 text-center">
      <div className="inline-flex items-center space-x-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
        <Icon 
          name="ShieldCheckIcon" 
          size={18} 
          variant="solid" 
          className="text-success" 
        />
        <span className="text-sm font-medium text-success">
          Secure Authentication
        </span>
      </div>
    </div>
  );
};

export default SecurityBadge;
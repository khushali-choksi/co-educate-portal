import React from 'react';

const BrandHeader = () => {
  return (
    <div className="text-center space-y-4 mb-8">
      <div className="flex items-center justify-center">
        <img 
          src="/logo.jpeg" 
          alt="Core Educate Logo" 
          className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
        />
      </div>

      <div className="space-y-2">
        <p className="text-base lg:text-lg font-medium text-brand-primary">
          Healthcare Management Portal
        </p>
      </div>
    </div>
  );
};

export default BrandHeader;
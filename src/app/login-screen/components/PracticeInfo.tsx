import React from 'react';
import Icon from '@/components/ui/AppIcon';

const PracticeInfo = () => {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
            Dr. Khushali Choksi
          </h3>
          <p className="text-sm text-text-secondary">
            Physiotherapist & Pilates Specialist
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-gradient-bg rounded-lg border border-border">
            <Icon 
              name="HeartIcon" 
              size={20} 
              variant="outline" 
              className="text-brand-primary flex-shrink-0 mt-0.5" 
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Physiotherapy
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Clinical expertise in healing
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gradient-bg rounded-lg border border-border">
            <Icon 
              name="SparklesIcon" 
              size={20} 
              variant="outline" 
              className="text-brand-secondary flex-shrink-0 mt-0.5" 
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Pilates
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Mindful movement education
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-gradient-bg rounded-lg border border-border">
            <Icon 
              name="AcademicCapIcon" 
              size={20} 
              variant="outline" 
              className="text-brand-action flex-shrink-0 mt-0.5" 
            />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Education
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Wellness transformation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeInfo;
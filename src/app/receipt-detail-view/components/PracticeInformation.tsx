import Icon from '@/components/ui/AppIcon';

const PracticeInformation = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-6 clinical-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-action">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            CORE EDUCATE
          </h2>
          <p className="text-xs text-text-secondary">Physiotherapy & Pilates Practice</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="UserIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-0.5">Practitioner</p>
            <p className="text-sm font-medium text-text-primary">Dr. Khushali Choksi</p>
            <p className="text-xs text-text-secondary">Physiotherapist</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="MapPinIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-0.5">Practice Address</p>
            <p className="text-sm font-medium text-text-primary">
              123 Wellness Street, Ahmedabad, Gujarat 380001
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="PhoneIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-0.5">Contact</p>
            <p className="text-sm font-medium text-text-primary">+91 98765 43210</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted">
            <Icon name="EnvelopeIcon" size={16} variant="outline" className="text-text-secondary" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-text-secondary mb-0.5">Email</p>
            <p className="text-sm font-medium text-text-primary">contact@coreeducate.com</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-text-secondary text-center">
          Professional healthcare services since 2015
        </p>
      </div>
    </div>
  );
};

export default PracticeInformation;